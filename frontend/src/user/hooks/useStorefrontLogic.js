import { useEffect } from 'react';

export function useStorefrontLogic() {
  useEffect(() => {
    // Only run if the DOM is ready (which it is since we are in useEffect)
    let rafId = null;

    // --- PASTE VANILLA LOGIC ---
    const hasBS = typeof window.bootstrap !== "undefined";
    const noopUi = { show() {}, hide() {}, toggle() {} };

    const navCollapse = hasBS ? window.bootstrap.Collapse.getOrCreateInstance(document.getElementById("navMenu"), { toggle: false }) : noopUi;

    const $ = (id) => document.getElementById(id);

    function updateHeaderHeight() {
      const ann = document.querySelector(".ann-bar");
      const nav = $("mainNav");
      const h   = (ann?.offsetHeight || 0) + (nav?.offsetHeight || 0);
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }

    function updateActiveNav() {
      const links = document.querySelectorAll("#navMenu .nav-link");
      const pos   = window.scrollY + 130;
      let current = "home";
      document.querySelectorAll("main > section[id]").forEach(s => {
        if (s.offsetTop <= pos) current = s.id;
      });
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
      document.querySelectorAll(".drawer-link").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
    }

    function initReveal() {
      const els = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        els.forEach(el => el.classList.add("visible"));
        return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
      }, { threshold: 0.1, rootMargin: "0px 0px -36px 0px" });
      els.forEach(el => io.observe(el));
    }

    function showHeroFallback(section) {
      section.classList.add("no-3d");
      const fb = $("heroFallback");
      if (fb) fb.classList.remove("d-none");
      const c = $("heroCanvas");
      if (c) c.classList.add("d-none");
    }

    function makeStudioEnv(renderer) {
      if(typeof window.THREE === 'undefined') return null;
      const THREE = window.THREE;
      const size = 64;
      const faces = [];
      for (let i = 0; i < 6; i++) {
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const g = c.getContext("2d");
        const grad = g.createLinearGradient(0, 0, 0, size);
        grad.addColorStop(0, i === 2 ? "#46586c" : "#131c26");
        grad.addColorStop(0.55, "#0a1016");
        grad.addColorStop(1, "#04070a");
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
        g.fillStyle = "rgba(200,245,60,0.85)";
        g.fillRect(0, Math.round(size * 0.40), size, 3);
        g.fillStyle = "rgba(120,170,255,0.55)";
        g.fillRect(0, Math.round(size * 0.62), size, 2);
        faces.push(c);
      }
      const cube = new THREE.CubeTexture(faces);
      cube.needsUpdate = true;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromCubemap(cube).texture;
      pmrem.dispose();
      return env;
    }

    function initHero3D() {
      const section = $("heroSection");
      const canvas  = $("heroCanvas");
      const sticky  = section && section.querySelector(".hero-sticky");
      if (!section || !canvas) return;

      const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (typeof window.THREE === "undefined") {
        showHeroFallback(section);
        return;
      }
      const THREE = window.THREE;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch { showHeroFallback(section); return; }

      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      if (typeof THREE.sRGBEncoding !== "undefined") renderer.outputEncoding = THREE.sRGBEncoding;
      if (typeof THREE.ACESFilmicToneMapping !== "undefined") {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
      }
      renderer.shadowMap.enabled = false;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 7);

      scene.add(new THREE.AmbientLight(0xffffff, 1.0));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
      keyLight.position.set(3, 5, 5);
      scene.add(keyLight);
      const limeSpot = new THREE.PointLight(0xc8f53c, 1.2, 40);
      limeSpot.position.set(-3, 2, 4);
      scene.add(limeSpot);
      const blueRim = new THREE.PointLight(0x4488ff, 0.8, 40);
      blueRim.position.set(4, -1, 3);
      scene.add(blueRim);
      const backRim = new THREE.PointLight(0xffffff, 0.5, 40);
      backRim.position.set(0, 3, -6);
      scene.add(backRim);

      try { scene.environment = makeStudioEnv(renderer); } catch {}

      const productGroup = new THREE.Group();
      scene.add(productGroup);
      let modelHolder  = null;
      let modelScale   = 1;
      let introEase    = 0;

      const loaderEl  = $("modelLoader");
      const loaderTxt = $("modelLoaderText");
      if (loaderEl) loaderEl.classList.remove("d-none");

      if (THREE.GLTFLoader) {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/gltf/");
        dracoLoader.preload();
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
        const tryLoad = (attempt) => {
          gltfLoader.load(
            "/assets/3dimage.glb?v=1",
            (gltf) => {
              const model = gltf.scene;
              model.traverse(child => {
                if (!child.isMesh) return;
                child.castShadow = false;
                child.receiveShadow = false;
                child.frustumCulled = false;
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach((m) => {
                  if (!m) return;
                  if ("envMapIntensity" in m) m.envMapIntensity = 1;
                  if (m.map) m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  m.needsUpdate = true;
                });
              });
              const box  = new THREE.Box3().setFromObject(model);
              const size = box.getSize(new THREE.Vector3());
              const ctr  = box.getCenter(new THREE.Vector3());
              if (Number.isFinite(size.x + size.y + size.z) && size.x + size.y + size.z > 0) {
                model.position.sub(ctr);
                const maxDim = Math.max(size.x, size.y, size.z);
                modelScale = maxDim > 0 ? 2.6 / maxDim : 1;
              }
              modelHolder = new THREE.Group();
              modelHolder.add(model);
              modelHolder.scale.setScalar(0.001);
              productGroup.add(modelHolder);
              if (loaderEl) loaderEl.classList.add("d-none");
            },
            (xhr) => {
              if (loaderEl && loaderTxt) {
                loaderTxt.textContent = xhr.total > 0
                  ? `Loading 3D… ${Math.round(xhr.loaded / xhr.total * 100)}%`
                  : `Loading 3D… ${(xhr.loaded / 1048576).toFixed(1)} MB`;
              }
            },
            (err) => {
              if (attempt < 3) { setTimeout(() => tryLoad(attempt + 1), 900 * attempt); return; }
              if (loaderEl) loaderEl.classList.add("d-none");
            }
          );
        };
        tryLoad(1);
      } else {
        if (loaderEl) loaderEl.classList.add("d-none");
        showHeroFallback(section);
      }

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.6, 0.03, 20, 120),
        new THREE.MeshBasicMaterial({ color: 0xc8f53c, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring.rotation.x = Math.PI * 0.45;
      scene.add(ring);
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.1, 0.018, 12, 96),
        new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring2.rotation.x = Math.PI * 0.3; ring2.rotation.z = Math.PI * 0.25;
      scene.add(ring2);

      const PARTS = 160;
      const pPos  = new Float32Array(PARTS * 3);
      const pSpd  = new Float32Array(PARTS);
      for (let i = 0; i < PARTS; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 12;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
        pSpd[i] = 0.08 + Math.random() * 0.3;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xc8f53c, size: 0.05, transparent: true, opacity: 0.32, sizeAttenuation: true })));

      const space    = section.querySelector(".hero-scroll-space");
      const stages   = [...document.querySelectorAll(".hero-stage")];
      const railDots  = [...document.querySelectorAll(".rail-dot")];
      const railFills = [...document.querySelectorAll(".rail-track > span")];
      const cueEl    = $("scrollCue");
      const statusEl = $("heroStatus");

      let scrollTarget  = 0;
      let scrollCurrent = 0;
      let activeStage   = -1;
      let heroVisible   = true;
      const clock = new THREE.Clock();

      const smoothstep = (x, a, b) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      const isMobile = () => innerWidth < 992;

      function setSize() {
        const w = section.clientWidth;
        const h = (sticky && sticky.clientHeight) || innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }

      function readScroll() {
        if (!space) return;
        const total = space.offsetHeight - ((sticky && sticky.clientHeight) || innerHeight);
        scrollTarget = total > 0 ? Math.min(1, Math.max(0, -space.getBoundingClientRect().top / total)) : 0;
      }

      function setStage(index) {
        if (index === activeStage) return;
        activeStage = index;
        stages.forEach((s, i) => s.classList.toggle("active", i === index));
        railDots.forEach((d, i) => d.classList.toggle("active", i === index));
        if (statusEl) statusEl.textContent = `Stage ${index + 1} of ${stages.length}`;
      }

      function animate() {
        rafId = requestAnimationFrame(animate);
        if (!REDUCED) scrollCurrent += (scrollTarget - scrollCurrent) * 0.045;
        const p  = REDUCED ? 0 : scrollCurrent;
        const t  = REDUCED ? 0 : clock.getElapsedTime();
        const mb = isMobile();

        const idleY  = Math.sin(t * 0.6) * 0.12;
        const idleRZ = Math.sin(t * 0.4) * 0.04;
        productGroup.rotation.y  = p * Math.PI * 3 + Math.sin(t * 0.5) * 0.06;
        productGroup.rotation.z  = idleRZ + Math.sin(p * Math.PI) * 0.05;
        productGroup.position.y  = idleY + p * 0.3;

        const blend = smoothstep(p, 0.6, 1.0);
        if (mb) {
          productGroup.position.x = 0; productGroup.position.y = 2.1 + p * 0.2; productGroup.scale.setScalar(0.92);
        } else {
          const wideBias = Math.min(0.8, Math.max(0, camera.aspect - 1.45) * 1.4);
          productGroup.position.x = (3.3 + wideBias) * (1 - blend);
          productGroup.scale.setScalar(1);
        }

        if (modelHolder) {
          introEase = REDUCED ? 1 : Math.min(1, introEase + (1 - introEase) * 0.055);
          modelHolder.scale.setScalar(modelScale * Math.max(introEase, 0.0001));
        }

        ring.position.copy(productGroup.position); ring.rotation.y  = t * 0.5 + p * Math.PI * 2; ring.rotation.x  = Math.PI * 0.45 + Math.sin(t * 0.3) * 0.06;
        ring2.position.copy(productGroup.position); ring2.rotation.y = -t * 0.7 - p * Math.PI * 2.5; ring2.rotation.z = Math.PI * 0.25 + t * 0.2;

        if (mb) { camera.position.set(0, 0.5, 7.5); camera.lookAt(0, 1.4, 0); }
        else {
          const camX = -1.2 + blend * 1.2;
          const camZ = 6.5 - Math.sin(p * Math.PI) * 0.5;
          camera.position.set(camX, 0.2 + idleY * 0.3, camZ);
          camera.lookAt(productGroup.position.x * 0.45, productGroup.position.y * 0.5, 0);
        }

        limeSpot.position.set(productGroup.position.x + Math.cos(t * 0.7) * 3.5, 2 + Math.sin(t * 0.4) * 1.5, 3 + Math.sin(t * 0.7) * 2);
        blueRim.position.set(productGroup.position.x - Math.cos(t * 0.5) * 3, -1 + Math.sin(t * 0.3), 4);

        if (!REDUCED) {
          const pos = pGeo.attributes.position.array;
          for (let i = 0; i < PARTS; i++) {
            pos[i * 3 + 1] += pSpd[i] * 0.014;
            if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5;
          }
          pGeo.attributes.position.needsUpdate = true;
        }

        railFills.forEach((el, i) => { el.style.width = `${Math.min(1, Math.max(0, p * 2 - i)) * 100}%`; });
        if (cueEl) cueEl.classList.toggle("hide", p > 0.02);
        setStage(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);
        renderer.render(scene, camera);
      }

      const start = () => { if (rafId === null && heroVisible) rafId = requestAnimationFrame(animate); };
      const stop  = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } };

      const io = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        heroVisible ? start() : stop();
      });
      io.observe(section);

      window.addEventListener("scroll", readScroll, { passive: true });
      window.addEventListener("resize", () => { setSize(); readScroll(); });

      setSize(); readScroll(); start();
      return () => {
        io.disconnect();
        stop();
        window.removeEventListener("scroll", readScroll);
      };
    }

    function initRipple() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.addEventListener("pointerdown", (e) => {
        const t = e.target.closest("button, .btn-hero-primary, .btn-hero-ghost, .btn-primary-sm, .f-pill, .nav-link, .socials a");
        if (!t || t.disabled) return;
        const r = t.getBoundingClientRect();
        const d = Math.max(r.width, r.height) * 1.2;
        const s = document.createElement("span");
        s.className = "ripple-ink";
        s.style.width = s.style.height = d + "px";
        s.style.left = e.clientX - r.left - d / 2 + "px";
        s.style.top  = e.clientY - r.top - d / 2 + "px";
        t.appendChild(s);
        setTimeout(() => s.remove(), 600);
      });
    }

    function initDrawer() {
      const drawer = $("navDrawer");
      const scrim  = $("navScrim");
      const burger = $("navBurger");
      if (!drawer || !scrim || !burger) return;
      const open = () => { drawer.classList.add("open"); scrim.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); burger.setAttribute("aria-expanded", "true"); document.body.classList.add("no-scroll"); };
      const close = () => { drawer.classList.remove("open"); scrim.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); };
      burger.addEventListener("click", () => (drawer.classList.contains("open") ? close() : open()));
      $("navDrawerClose")?.addEventListener("click", close);
      scrim.addEventListener("click", close);
      drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
      window.addEventListener("resize", () => { if (innerWidth >= 992) close(); });
    }

    function initAnnouncePop() {
      const pop = $("annPop");
      if (!pop) return;
      if (sessionStorage.getItem("neatify-ann-dismissed")) return;
      setTimeout(() => pop.classList.add("show"), 1200);
      $("annPopClose")?.addEventListener("click", () => { pop.classList.remove("show"); sessionStorage.setItem("neatify-ann-dismissed", "1"); });
    }

    function boot() {
      updateHeaderHeight();
      initDrawer();
      initAnnouncePop();
      initRipple();
      initReveal();
      const cleanup3D = initHero3D();

      const scrollListener = () => {
        $("mainNav")?.classList.toggle("scrolled", window.scrollY > 20);
        $("backToTop")?.classList.toggle("show", window.scrollY > 700);
        updateActiveNav();
      };
      window.addEventListener("scroll", scrollListener, { passive: true });
      window.addEventListener("resize", updateHeaderHeight);
      $("backToTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(() => { updateHeaderHeight(); window.dispatchEvent(new Event("resize")); }); }

      return () => {
        if(cleanup3D) cleanup3D();
        window.removeEventListener("scroll", scrollListener);
        window.removeEventListener("resize", updateHeaderHeight);
      };
    }
    
    // We delay the boot very slightly to ensure the DOM is completely flushed and Refs are valid
    const timerId = setTimeout(() => {
        boot();
    }, 100);

    return () => clearTimeout(timerId);

  }, []);
}

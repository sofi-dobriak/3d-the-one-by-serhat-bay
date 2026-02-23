
export function destroyAFrameScene(sceneEl) {
    if (!sceneEl) return;

    sceneEl.pause();

    sceneEl.object3D.traverse(obj => {
        if (!obj) return;

        if (obj.geometry) {
            obj.geometry.dispose();
        }

        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => disposeMaterial(m));
            } else {
                disposeMaterial(obj.material);
            }
        }
    });

    if (sceneEl.renderer) {
        sceneEl.renderer.clear();
        sceneEl.renderer.dispose();
    }

    sceneEl.parentNode.removeChild(sceneEl);
}

function disposeMaterial(material) {
    for (const key in material) {
        const value = material[key];
        if (value && value.isTexture) {
            value.dispose();
        }
    }
    material.dispose();
}


export function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function checkTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}
// "use strict";

// Next thing:
// measurements? distances?
// toggle vertical grid-lines
// maybe only being able to lock one?



let toolsAreActive = false;

const createPseudoBody = () => {
    const documentElRect = document.documentElement.getBoundingClientRect();
    let pseudoBody = document.createElement('div');

    pseudoBody.id = 'shed_tools_-_pseudo_body';
    pseudoBody.style.position = 'absolute';
    pseudoBody.style.zIndex = 10000000;
    pseudoBody.style.top = 0;
    pseudoBody.style.left = 0;
    pseudoBody.style.height = documentElRect.height + 'px';
    pseudoBody.style.width = documentElRect.width + 'px';
    pseudoBody.style.pointerEvents = 'none';

    document.body.appendChild(pseudoBody);
    return pseudoBody;
}
const shedToolsContainer = createPseudoBody();

// Create bar for settings
const createSettingsBar = () => {
    let barEl = document.createElement('div');
    let s = barEl.style;

    s.background = '#202020';
    s.border = '1px solid #EEEEEE';
    s.color = '#EEEEEE';
    s.position = 'fixed';
    s.zIndex = 10000001;
    s.bottom = 0;
    s.left = 0;
    s.borderTopRightRadius = '5px';
    s.padding = '6px';

    const createOnOff = () => {
        let onOffEl = document.createElement('input');
        onOffEl.type = 'checkbox';
        onOffEl.id = 'shed_tools_-_settings_-_on_off';
        onOffEl.style.verticalAlign = 'middle';

        return onOffEl;
    }
    const onOff = createOnOff();

    const createColorSlider = () => {
        let sliderEl = document.createElement('input');
        sliderEl.type = 'range';
        sliderEl.min = 0;
        sliderEl.max = 360;
        sliderEl.value = 180;
        sliderEl.id = 'shed_tools_-_settings_-_color_slider';
        sliderEl.style.verticalAlign = 'middle';;

        return sliderEl;
    }
    const colorSlider = createColorSlider();

    barEl.appendChild(onOff);
    barEl.appendChild(colorSlider);
    document.body.appendChild(barEl);

    return barEl;
}
const settingsBar = createSettingsBar();


let overlayColors = {
    marginBox: `hsla(${180}, 100%, 50%, 1)`,
    paddingBox: `hsla(${180 + 120}, 100%, 50%, 1)`,
    contentBox: `hsla(${180 + 240}, 100%, 50%, 1)`,
    setHue: function(num) {
        num = parseInt(num);
        let numB = 120;
        let pBoxHue = num + numB;
        let cBoxHue = num + (numB * 2);

        if (pBoxHue > 360) {
            pBoxHue -= 360;
        }
        if (cBoxHue > 360) {
            cBoxHue -= 360;
        }
        this.marginBox = `hsla(${num}, 100%, 50%, 1)`;
        this.paddingBox = `hsla(${pBoxHue}, 100%, 50%, 1)`;
        this.contentBox = `hsla(${cBoxHue}, 100%, 50%, 1)`;
    }
}

const getOverlayEl = (currentTarget) => {
    const style = getComputedStyle(currentTarget);
    const elRect = currentTarget.getBoundingClientRect();

    let {   marginTop, marginRight, 
            marginBottom, marginLeft, paddingTop, 
            paddingRight, paddingBottom, paddingLeft
        } = style;

    const idNum = Math.round(Date.now() + (Math.random() * 1000));
    const wrapperId = 'shed_tools_-_overlay_wrapper_' + idNum;
    const innerId = 'shed_tools_-_overlay_inner_' + idNum;

    let wrapperEl = document.createElement('div');
    wrapperEl.style.width = currentTarget.clientWidth + 'px';
    wrapperEl.style.height = currentTarget.clientHeight + 'px';
    wrapperEl.style.position = 'absolute';
    wrapperEl.style.top = elRect.top + window.scrollY  + 'px';
    wrapperEl.style.left = elRect.left + window.scrollX + 'px';
    wrapperEl.style.background = 'transparent';
    wrapperEl.style.opacity = '.5';
    wrapperEl.id = wrapperId;

    let transition = 'all .5s ease';

    let marginBoxDiv = document.createElement('div');
    marginBoxDiv.style.background = overlayColors.marginBox;
    marginBoxDiv.style.position = 'absolute';
    marginBoxDiv.style.zIndex = -1;
    marginBoxDiv.style.top = '-' + marginTop;
    marginBoxDiv.style.right = '-' + marginRight;
    marginBoxDiv.style.bottom = '-' + marginBottom;
    marginBoxDiv.style.left = '-' + marginLeft;
    marginBoxDiv.innerText = 'm';
    marginBoxDiv.style.transition = transition;
    
    let paddingBoxDiv = document.createElement('div');
    paddingBoxDiv.id = innerId;
    paddingBoxDiv.style.background = overlayColors.paddingBox;
    paddingBoxDiv.style.width = currentTarget.clientWidth + 'px';
    paddingBoxDiv.style.height = currentTarget.clientHeight + 'px';
    paddingBoxDiv.innerText = '.p';
    paddingBoxDiv.style.transition = transition;
    // paddingBoxDiv.style.pointerEvents = 'auto';

    let contentBoxDiv = document.createElement('div');
    contentBoxDiv.style.position = 'absolute';
    contentBoxDiv.style.zIndex = 1;
    contentBoxDiv.style.top = paddingTop;
    contentBoxDiv.style.right = paddingRight;
    contentBoxDiv.style.bottom = paddingBottom;
    contentBoxDiv.style.left = paddingLeft;
    contentBoxDiv.style.background = overlayColors.contentBox;
    contentBoxDiv.innerText = '..c';
    contentBoxDiv.style.transition = transition;

    wrapperEl.classList.add('shed_tools_-_overlay', 'shed_tools_-_overlay_wrapper');
    paddingBoxDiv.classList.add('shed_tools_-_overlay', 'shed_tools_-_overlay_inner');

    wrapperEl.appendChild(marginBoxDiv);
    wrapperEl.appendChild(paddingBoxDiv);
    wrapperEl.appendChild(contentBoxDiv);

    return wrapperEl;
}

/**
 * Handle overlay existence on mouse over
 * @param {HTMLElement} a Current mouse over
 * @param {HTMLElement} b Last mouse over
 * @returns void
 */
const toggleOverlay = (a, b) => {
    if (a !== b) {
        if (a.tagName !== 'BODY') { 
            // check a
            if (!a.shed_tools_overlay) {
                // create overlay
                const newOverlay = getOverlayEl(a);
                shedToolsContainer.appendChild(newOverlay);
                a.shed_tools_overlay = newOverlay;
            }
        };

        // check b
        if (b.shed_tools_overlay) {
            let bIsLockedOverlay = b.shed_tools_overlay.classList.contains('shed_tools_-_locked_overlay');

            if (!bIsLockedOverlay) {
                // remove overlay
                shedToolsContainer.removeChild(b.shed_tools_overlay);
                delete b.shed_tools_overlay;
            }
        }
    } else {
        return;
    }

}

let mousingOver = {
    now: undefined,
    last: undefined
}

document.body.addEventListener('mousemove', e => {
    e.stopPropagation();

    if (!toolsAreActive) {
        return;
    }

    let mouseTarget = e.target;

    mousingOver.now = mouseTarget;

    if (mousingOver.last !== undefined) {
        toggleOverlay(mousingOver.now, mousingOver.last);
    }

    mousingOver.last = mouseTarget;
})

const lockKey = 'IntlBackslash';

document.body.addEventListener('keydown', e => {
    e.stopPropagation();

    if (!toolsAreActive) {
        return;
    }

    let overlay = mousingOver.now.shed_tools_overlay;
    
    if (e.code === lockKey) {
        overlay.classList.toggle('shed_tools_-_locked_overlay');
    }
})

settingsBar.querySelector('#shed_tools_-_settings_-_color_slider')
    .addEventListener('input', e => {
        overlayColors.setHue(e.target.value);

        let overlays = shedToolsContainer.children;
        for (let i = 0; i < overlays.length; i++) {
            let overlay = overlays.item(i);
            overlay.children.item(0).style.background = overlayColors.marginBox;
            overlay.children.item(1).style.background = overlayColors.paddingBox;
            overlay.children.item(2).style.background = overlayColors.contentBox;
        }
    })

settingsBar.querySelector('#shed_tools_-_settings_-_on_off')
    .addEventListener('input', e => {
        toolsAreActive = e.target.checked;

        toolsAreActive ?
        shedToolsContainer.style.display = 'block' :
        shedToolsContainer.style.display = 'none';
    })
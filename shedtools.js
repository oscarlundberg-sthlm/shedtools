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
    barEl.id = 'shed_tools_-_settings_bar';
    let s = barEl.style;

    s.background = '#202020';
    s.borderTop = '1px solid #EEEEEE';
    s.borderRight = '1px solid #EEEEEE';
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


// Create some styles
const createStyles = () => {
    let style = document.createElement('style');
    style.textContent = `
        #shed_tools_-_settings_bar input {
            all: revert;
        }
        #shed_tools_-_pseudo_body {
            font-family: monospace;
            font-size: 12px;
        }
        .shed_tools_-_locked_overlay :last-child::after {
            content: '[locked]';
            font-weight: 600;
        }
    `;
    document.head.append(style);
}
createStyles();


let overlayColors = {
    marginBox: `hsla(${180}, 100%, 50%, 1)`,
    paddingBox: `hsla(${180 + 90}, 100%, 50%, 1)`,
    contentBox: `hsla(${180 + 180}, 100%, 50%, 1)`,
    lineColor: `hsla(${180 + 270}, 100%, 50%, 1)`,
    setHue: function(num) {
        num = parseInt(num);
        let numB = 90;
        let pBoxHue = num + numB;
        let cBoxHue = num + (numB * 2);
        let lineHue = num + (numB * 3);

        if (pBoxHue > 360) {
            pBoxHue -= 360;
        }
        if (cBoxHue > 360) {
            cBoxHue -= 360;
        }
        if (lineHue > 360) {
            lineHue -= 360;
        }
        this.marginBox = `hsla(${num}, 100%, 50%, 1)`;
        this.paddingBox = `hsla(${pBoxHue}, 100%, 50%, 1)`;
        this.contentBox = `hsla(${cBoxHue}, 100%, 50%, 1)`;
        this.lineColor = `hsla(${lineHue}, 100%, 50%, 1)`;
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

    let transition = 'all .1s ease';

    let marginBoxDiv = document.createElement('div');
    marginBoxDiv.style.background = overlayColors.marginBox;
    marginBoxDiv.style.position = 'absolute';
    marginBoxDiv.style.zIndex = -1;
    marginBoxDiv.style.top = '-' + marginTop;
    marginBoxDiv.style.right = '-' + marginRight;
    marginBoxDiv.style.bottom = '-' + marginBottom;
    marginBoxDiv.style.left = '-' + marginLeft;
    marginBoxDiv.innerText = 'margin';
    marginBoxDiv.style.transition = transition;
    
    let paddingBoxDiv = document.createElement('div');
    paddingBoxDiv.id = innerId;
    paddingBoxDiv.style.background = overlayColors.paddingBox;
    paddingBoxDiv.style.width = currentTarget.clientWidth + 'px';
    paddingBoxDiv.style.height = currentTarget.clientHeight + 'px';
    paddingBoxDiv.innerText = 'padding';
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
    contentBoxDiv.innerText = 'content';
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


const createMeasurementLine = () => {
    let line = document.createElement('div');
    let s = line.style;
    let isVertical = null;
    let lineHeight = '200px'; // calculate correct
    let lineWidth = '200px'; // calculate correct

    s.background = overlayColors.lineColor;
    s.height = isVertical ? lineHeight : '2px';
    s.width = !isVertical ? lineWidth : '2px';
    s.position = 'absolute';
    s.top = '0px'; // calculate
    s.left = '0px'; // calculate

    let lineInner = document.createElement('div');
    lineInner.style.position = relative;

    let text = document.createElement('p');
    text.textContent = isVertical ? lineHeight + 'px' : lineWidth + 'px';
    let ts = text.style;
    ts.position = 'absolute';
    ts.top = '50%';
    ts.left = '50%';
    ts.transform = 'translate(-50%, -50%)';
    ts.background = '#FFFFFF';
    ts.color = '#202020';
    
}
const displayMeasurements = (lockedEl, mouseOverEl) => {
    if (!mousingOver || !lockedEl) {
        return;
    }
    lockedElRect = lockedEl.getBoundingClientRect();
    mouseOverElRect = mouseOverEl.getBoundingClientRect();
    if (lockedElRect.top === mouseOverElRect.top &&
        lockedElRect.right === mouseOverElRect.right &&
        lockedElRect.bottom === mouseOverElRect.bottom &&
        lockedElRect.left === mouseOverElRect.left
    ) {
        return;
    }

    // Use a combination of direction and distance
    let distanceX, distanceY;
    
    // console.log('lockedElRect', lockedElRect);
    // console.log('mouseOverElRect', mouseOverElRect);
    if (mouseOverElRect.bottom < lockedElRect.top) {
        console.log('above');
    }
    if (mouseOverElRect.top > lockedElRect.bottom) {
        console.log('below');
    }
    if (mouseOverElRect.right < lockedElRect.left) {
        console.log('to the left');
    }
    if (mouseOverElRect.left > lockedElRect.right) {
        console.log('to the right');
    }
}



let mousingOver = {
    now: undefined,
    last: undefined
}
let lockedEl = null; // limit locked els to 1 el

document.body.addEventListener('mousemove', e => {
    e.stopPropagation();

    if (!toolsAreActive) {
        return;
    }

    let mouseTarget = e.target;

    mousingOver.now = mouseTarget;

    if (mousingOver.last !== undefined) {
        toggleOverlay(mousingOver.now, mousingOver.last);
        displayMeasurements(lockedEl, mousingOver.now);
    }

    mousingOver.last = mouseTarget;
})

// LOCKING
const lockKey = 'IntlBackslash';

document.body.addEventListener('keydown', e => {
    e.stopPropagation();

    if (!toolsAreActive) {
        return;
    }

    let overlay = mousingOver.now.shed_tools_overlay;
    
    if (e.code === lockKey) {
        if (lockedEl === overlay) {
            overlay.classList.remove('shed_tools_-_locked_overlay');
            lockedEl = undefined;
        } else
        if (!lockedEl) {
            overlay.classList.add('shed_tools_-_locked_overlay');
            lockedEl = overlay;
        }
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
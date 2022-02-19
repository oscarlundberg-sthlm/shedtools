

// Next thing:
// measurements? distances?
// color changer HSL
// toggle vertical grid-lines
// maybe only being able to lock one?



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
}
createPseudoBody();
const shedToolsContainer = document.getElementById('shed_tools_-_pseudo_body');

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
    wrapperEl.id = wrapperId;

    let marginBoxDiv = document.createElement('div');
    marginBoxDiv.style.background = '#00FF0050';
    marginBoxDiv.style.position = 'absolute';
    marginBoxDiv.style.top = '-' + marginTop;
    marginBoxDiv.style.right = '-' + marginRight;
    marginBoxDiv.style.bottom = '-' + marginBottom;
    marginBoxDiv.style.left = '-' + marginLeft;
    marginBoxDiv.innerText = 'm';
    
    let paddingBoxDiv = document.createElement('div');
    paddingBoxDiv.id = innerId;
    paddingBoxDiv.style.background = '#FF000050';
    paddingBoxDiv.style.width = currentTarget.clientWidth + 'px';
    paddingBoxDiv.style.height = currentTarget.clientHeight + 'px';
    paddingBoxDiv.innerText = '.p';
    // paddingBoxDiv.style.pointerEvents = 'auto';

    let contentBoxDiv = document.createElement('div');
    contentBoxDiv.style.position = 'absolute';
    contentBoxDiv.style.top = paddingTop;
    contentBoxDiv.style.right = paddingRight;
    contentBoxDiv.style.bottom = paddingBottom;
    contentBoxDiv.style.left = paddingLeft;
    contentBoxDiv.style.background = '#0000FF50';
    contentBoxDiv.innerText = '..c';

    wrapperEl.classList.add('shed_tools_-_overlay', 'shed_tools_-_overlay_wrapper');
    paddingBoxDiv.classList.add('shed_tools_-_overlay', 'shed_tools_-_overlay_inner');

    wrapperEl.appendChild(marginBoxDiv);
    wrapperEl.appendChild(paddingBoxDiv);
    wrapperEl.appendChild(contentBoxDiv);

    return wrapperEl;
}

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

    let overlay = mousingOver.now.shed_tools_overlay;
    
    if (e.code === lockKey) {
        overlay.classList.toggle('shed_tools_-_locked_overlay');
    }
})
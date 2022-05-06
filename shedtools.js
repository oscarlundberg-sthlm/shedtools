let toolsAreActive = false;

const createPseudoBody = () => {
    const documentElRect = document.documentElement.getBoundingClientRect();
    let pseudoBody = document.createElement("div");

    pseudoBody.id = "shed_tools_-_pseudo_body";
    pseudoBody.style.position = "absolute";
    pseudoBody.style.zIndex = 10000000;
    pseudoBody.style.top = 0;
    pseudoBody.style.left = 0;
    pseudoBody.style.height = documentElRect.height + "px";
    pseudoBody.style.width = documentElRect.width + "px";
    pseudoBody.style.pointerEvents = "none";

    document.body.appendChild(pseudoBody);
    return pseudoBody;
};
const shedToolsContainer = createPseudoBody();

// Create bar for settings
const createSettingsBar = () => {
    let barEl = document.createElement("div");
    barEl.id = "shed_tools_-_settings_bar";

    const createOnOff = () => {
        let onOffEl = document.createElement("input");
        onOffEl.type = "checkbox";
        onOffEl.id = "shed_tools_-_settings_-_on_off";
        onOffEl.style.verticalAlign = "middle";

        return onOffEl;
    };
    const onOff = createOnOff();

    const createColorSlider = () => {
        let sliderEl = document.createElement("input");
        sliderEl.type = "range";
        sliderEl.min = 0;
        sliderEl.max = 360;
        sliderEl.value = 180;
        sliderEl.id = "shed_tools_-_settings_-_color_slider";
        sliderEl.style.verticalAlign = "middle";

        return sliderEl;
    };
    const colorSlider = createColorSlider();

    const createVerticalGridSetter = () => {
        let columnCountInput = document.createElement("input");
        let columnWidthInput = document.createElement("input");
        let gutterWidthInput = document.createElement("input");
        let verticalGridSetterEl = document.createElement("div");
        verticalGridSetterEl.id =
            "shed_tools_-_settings_-_vertical_grid_setter";

        columnCountInput.type =
            columnWidthInput.type =
            gutterWidthInput.type =
                "number";
        columnCountInput.id =
            "shed_tools_-_settings_-_vertical_grid_column_count";
        columnWidthInput.id =
            "shed_tools_-_settings_-_vertical_grid_column_width";
        gutterWidthInput.id =
            "shed_tools_-_settings_-_vertical_grid_gutter_width";
        columnCountInput.placeholder = "Column count";
        columnWidthInput.placeholder = "Column width";
        gutterWidthInput.placeholder = "Gutter width";

        verticalGridSetterEl.appendChild(columnCountInput);
        verticalGridSetterEl.appendChild(columnWidthInput);
        verticalGridSetterEl.appendChild(gutterWidthInput);

        return verticalGridSetterEl;
    };
    const verticalGrid = createVerticalGridSetter();

    const onOffAndSliderWrapper = document.createElement('div');
    onOffAndSliderWrapper.appendChild(onOff);
    onOffAndSliderWrapper.appendChild(colorSlider);

    barEl.appendChild(onOffAndSliderWrapper);
    barEl.appendChild(verticalGrid);
    document.body.appendChild(barEl);

    return barEl;
};
const settingsBar = createSettingsBar();

const createStyles = () => {
    let style = document.createElement("style");
    style.textContent = `
        #shed_tools_-_settings_bar {
            background: #202020CC;
            border-top: 1px solid #EEEEEE;
            border-right: 1px solid #EEEEEE;
            color: #EEEEEE;
            position: fixed;
            z-index: 10000001;
            bottom: 0;
            left: 0;
            border-radius: 5px;
            padding-top: 8px;
            padding-bottom: 8px;
            font-family: monospace;
            font-size: 12px;
        }
        #shed_tools_-_settings_bar::after {
            content: 'shed tools by Oscar Lundberg';
            position: absolute;
            bottom: 0;
            right: 0;
        }
        #shed_tools_-_settings_bar > * {
            padding: 8px 14px;
        }
        #shed_tools_-_settings_bar *:hover::after {
            background: #888;
            color: #FFF;
            padding: 1em;
            border-radius: 5px;
            position: absolute;
            top: 0;
            left: 0;
            transform: translateY(-100%);
        }
        #shed_tools_-_settings_-_on_off:hover::after {
            content: "On/off for element selection. Press 'l' to 'lock' a selected element"
        }
        #shed_tools_-_settings_-_color_slider:hover::after {
            content: "Change the selection colors if it's hard to see";
        }
        #shed_tools_-_settings_-_vertical_grid_setter:hover::after {
            content: "Create a vertical grid to check your alignments";
        }
        .measure-function-display:hover::after {
            content: "Measurements. Press 'm' to measure, and again to lock";
        }
        #shed_tools_-_settings_bar input {
            all: revert;
        }
        #shed_tools_-_settings_-_vertical_grid_setter > input {
            width: 14ch;
        }
        #shed_tools_-_pseudo_body {
            font-family: monospace;
            font-size: 12px;
        }
        .shed_tools_-_locked_overlay :last-child::after {
            content: '[locked]';
            font-weight: 600;
        }
        .shed_tools_-_vertical_grid_-_column {
            background: #ff00003d;
        }
    `;
    document.head.append(style);
};
createStyles();

const removeVerticalGrid = () => {
    const grid = document.querySelector('#shed_tools_-_vertical_grid_-_container_outer');
    if (!grid) { return };
    grid.remove();
}

const createVerticalGrid = (columnCount, columnWidth, gutterWidth) => {
    removeVerticalGrid();
    if (!columnCount || !columnWidth || !gutterWidth) {
        return;
    }

    let gridContainer, gridContainerInner;

    gridContainer = document.createElement("div");
    gridContainer.id = "shed_tools_-_vertical_grid_-_container_outer";
    let gs = gridContainer.style;
    gs.display = "flex";
    gs.justifyContent = "center";
    gs.position = "fixed";
    gs.zIndex = 10000000;
    gs.inset = 0;
    gs.pointerEvents = "none";

    gridContainerInner = document.createElement("div");
    gridContainerInner.id = "shed_tools_-_vertical_grid_-_container_inner";
    gridContainerInner.style.display = "flex";

    for (let i = 0; i < columnCount; i++) {
        let column = document.createElement("div");
        column.classList.add("shed_tools_-_vertical_grid_-_column");
        let cs = column.style;
        cs.margin = `0 ${gutterWidth / 2}px`;
        cs.width = columnWidth + "px";
        cs.height = "100%";

        gridContainerInner.append(column);
    }

    gridContainer.append(gridContainerInner);
    document.body.append(gridContainer);
}


let overlayColors = {
    marginBox: `hsla(${180}, 100%, 50%, 1)`,
    paddingBox: `hsla(${180 + 120}, 100%, 50%, 1)`,
    contentBox: `hsla(${180 + 240}, 100%, 50%, 1)`,
    setHue: function (num) {
        num = parseInt(num);
        let numB = 120;
        let pBoxHue = num + numB;
        let cBoxHue = num + numB * 2;

        if (pBoxHue > 360) {
            pBoxHue -= 360;
        }
        if (cBoxHue > 360) {
            cBoxHue -= 360;
        }
        this.marginBox = `hsla(${num}, 100%, 50%, 1)`;
        this.paddingBox = `hsla(${pBoxHue}, 100%, 50%, 1)`;
        this.contentBox = `hsla(${cBoxHue}, 100%, 50%, 1)`;
    },
};

const getOverlayEl = (currentTarget) => {
    const style = getComputedStyle(currentTarget);
    const elRect = currentTarget.getBoundingClientRect();

    let {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
    } = style;

    const idNum = Math.round(Date.now() + Math.random() * 1000);
    const wrapperId = "shed_tools_-_overlay_wrapper_" + idNum;
    const innerId = "shed_tools_-_overlay_inner_" + idNum;

    let wrapperEl = document.createElement("div");
    wrapperEl.style.width = currentTarget.clientWidth + "px";
    wrapperEl.style.height = currentTarget.clientHeight + "px";
    wrapperEl.style.position = "absolute";
    wrapperEl.style.top = elRect.top + window.scrollY + "px";
    wrapperEl.style.left = elRect.left + window.scrollX + "px";
    wrapperEl.style.background = "transparent";
    wrapperEl.style.opacity = ".5";
    wrapperEl.id = wrapperId;

    let transition = "all .1s ease";

    let marginBoxDiv = document.createElement("div");
    marginBoxDiv.style.background = overlayColors.marginBox;
    marginBoxDiv.style.position = "absolute";
    marginBoxDiv.style.zIndex = -1;
    marginBoxDiv.style.top = "-" + marginTop;
    marginBoxDiv.style.right = "-" + marginRight;
    marginBoxDiv.style.bottom = "-" + marginBottom;
    marginBoxDiv.style.left = "-" + marginLeft;
    marginBoxDiv.innerText = "margin";
    marginBoxDiv.style.transition = transition;

    let paddingBoxDiv = document.createElement("div");
    paddingBoxDiv.id = innerId;
    paddingBoxDiv.style.background = overlayColors.paddingBox;
    paddingBoxDiv.style.width = currentTarget.clientWidth + "px";
    paddingBoxDiv.style.height = currentTarget.clientHeight + "px";
    paddingBoxDiv.innerText = "padding";
    paddingBoxDiv.style.transition = transition;
    // paddingBoxDiv.style.pointerEvents = 'auto';

    let contentBoxDiv = document.createElement("div");
    contentBoxDiv.style.position = "absolute";
    contentBoxDiv.style.zIndex = 1;
    contentBoxDiv.style.top = paddingTop;
    contentBoxDiv.style.right = paddingRight;
    contentBoxDiv.style.bottom = paddingBottom;
    contentBoxDiv.style.left = paddingLeft;
    contentBoxDiv.style.background = overlayColors.contentBox;
    contentBoxDiv.innerText = "content";
    contentBoxDiv.style.transition = transition;

    wrapperEl.classList.add(
        "shed_tools_-_overlay",
        "shed_tools_-_overlay_wrapper"
    );
    paddingBoxDiv.classList.add(
        "shed_tools_-_overlay",
        "shed_tools_-_overlay_inner"
    );

    wrapperEl.appendChild(marginBoxDiv);
    wrapperEl.appendChild(paddingBoxDiv);
    wrapperEl.appendChild(contentBoxDiv);

    return wrapperEl;
};

/**
 * Handle overlay existence on mouse over
 * @param {HTMLElement} a Current mouse over
 * @param {HTMLElement} b Last mouse over
 * @returns void
 */
const toggleOverlay = (a, b) => {
    if (a !== b) {
        if (a.tagName !== "BODY") {
            // check a
            if (!a.shed_tools_overlay) {
                // create overlay
                const newOverlay = getOverlayEl(a);
                shedToolsContainer.appendChild(newOverlay);
                a.shed_tools_overlay = newOverlay;
            }
        }

        // check b
        if (b.shed_tools_overlay) {
            let bIsLockedOverlay = b.shed_tools_overlay.classList.contains(
                "shed_tools_-_locked_overlay"
            );

            if (!bIsLockedOverlay) {
                // remove overlay
                shedToolsContainer.removeChild(b.shed_tools_overlay);
                delete b.shed_tools_overlay;
            }
        }
    } else {
        return;
    }
};

let mousingOver = {
    now: undefined,
    last: undefined,
};

window.addEventListener("mousemove", (e) => {
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
});

// LOCKING
const lockKey = "l";
let lockedEl = null; // limit locked els to 1 el

window.addEventListener("keydown", (e) => {
    e.stopPropagation();

    if (!toolsAreActive) {
        return;
    }

    let overlay = mousingOver.now.shed_tools_overlay;

    if (e.key === lockKey) {
        if (lockedEl === overlay) {
            overlay.classList.remove("shed_tools_-_locked_overlay");
            lockedEl = undefined;
        } else if (!lockedEl) {
            overlay.classList.add("shed_tools_-_locked_overlay");
            lockedEl = overlay;
        }
    }
});

settingsBar
    .querySelector("#shed_tools_-_settings_-_color_slider")
    .addEventListener("input", (e) => {
        overlayColors.setHue(e.target.value);

        let overlays = shedToolsContainer.children;
        for (let i = 0; i < overlays.length; i++) {
            let overlay = overlays.item(i);
            overlay.children.item(0).style.background = overlayColors.marginBox;
            overlay.children.item(1).style.background =
                overlayColors.paddingBox;
            overlay.children.item(2).style.background =
                overlayColors.contentBox;
        }
    });

settingsBar
    .querySelector("#shed_tools_-_settings_-_on_off")
    .addEventListener("input", (e) => {
        toolsAreActive = e.target.checked;

        toolsAreActive
            ? (shedToolsContainer.style.display = "block")
            : (shedToolsContainer.style.display = "none");
    });

const verticalGridValues = {
    columnCount: 0,
    columnWidth: 0,
    gutterWidth: 0,
}
settingsBar
    .querySelector("#shed_tools_-_settings_-_vertical_grid_setter")
    .addEventListener("input", (e) => {

        switch (e.target.id) {
            case "shed_tools_-_settings_-_vertical_grid_column_count":
                verticalGridValues.columnCount = e.target.value;
                break;
            case "shed_tools_-_settings_-_vertical_grid_column_width":
                verticalGridValues.columnWidth = e.target.value;
                break;
            case "shed_tools_-_settings_-_vertical_grid_gutter_width":
                verticalGridValues.gutterWidth = e.target.value;
                break;
        
            default:
                break;
        }
        createVerticalGrid(verticalGridValues.columnCount, verticalGridValues.columnWidth, verticalGridValues.gutterWidth);
    });

const measure = {
    displayEl: undefined,
    styleEl: undefined,
    measuring: false,
    p1: undefined,
    p2: undefined,
    pointStart: {
        x: 0,
        y: 0,
    },
    pointEnd: {
        x: 0,
        y: 0,
    },
    diff(end, start) {
        return end - start;
    },
    mouseMoveHandlerMeasure(e) {
        if (this.measuring && !this.pointStart.x && !this.pointStart.y) {
            this.pointStart = {
                x: e.x,
                y: e.y,
            };
        }
        if (this.measuring) {
            this.pointEnd = {
                x: e.x,
                y: e.y,
            };
        }
        this.p1.innerText = `x: ${this.diff(
            this.pointEnd.x,
            this.pointStart.x
        )}px`;
        this.p2.innerText = `y: ${this.diff(
            this.pointEnd.y,
            this.pointStart.y
        )}px`;
    },
    keyDownHandlerMeasure(e) {
        if (e.key === "m") {
            this.measuring = !this.measuring;
            if (this.measuring) {
                this.pointStart = {
                    x: 0,
                    y: 0,
                };
            }
        }
    },
    mouseMoveListener: undefined,
    keyDownListener: undefined,
    init() {
        this.displayEl = document.createElement("div");
        this.displayEl.className = "measure-function-display";
        const settingsBar = document.querySelector("#shed_tools_-_settings_bar");
        settingsBar.appendChild(this.displayEl);

        // const h4 = document.createElement("h4");
        this.p1 = document.createElement("p");
        this.p2 = document.createElement("p");
        // h4.innerText = "Press 'm' to measure";
        this.p1.innerText = `x: 0px`;
        this.p2.innerText = `y: 0px`;
        // this.displayEl.appendChild(h4);
        this.displayEl.appendChild(this.p1);
        this.displayEl.appendChild(this.p2);

        this.mouseMoveListener = this.mouseMoveHandlerMeasure.bind(this);
        this.keyDownListener = this.keyDownHandlerMeasure.bind(this);

        window.addEventListener("mousemove", this.mouseMoveListener);
        window.addEventListener("keydown", this.keyDownListener);

        const style = `
            .measure-function-display > * {
                all: initial;
                display: block;
                font-family: monospace;
                font-size: 12px;
                color: #DDDDDD;
            }
        `;

        this.styleEl = document.createElement("style");
        this.styleEl.textContent = style;
        document.head.appendChild(this.styleEl);
    },
    remove() {
        window.removeEventListener("mousemove", this.mouseMoveListener);
        window.removeEventListener("keydown", this.keyDownListener);
        this.styleEl.remove();
        this.displayEl.remove();
    },
};

measure.init();

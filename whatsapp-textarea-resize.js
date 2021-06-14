// ==UserScript==
// @name         Whatsapp TextArea Resize
// @namespace    https://github.com/kenng/whatsapp-chatbox-resizer
// @version      0.2
// @description  resizable chatbox text area
// @author       Ken Ng
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
    ('use strict');
    const mainPaneClassName = '_3QfZd two';
    const mutationTargetClass = '_1Flk2 _1sFTb';
    const mutataionTargetPrevSibling = '_3AUV4';
    let original_mouse_y = 0;

    function prependResizer() {
        var resizer = document.createElement('div');
        resizer.className = 'iw-resizer';
        resizer.style.height = '10px';
        resizer.style.backgroundColor = '#ccc';
        resizer.style.cursor = 'move';
        let footer = document.getElementsByTagName('footer')[0];
        footer.prepend(resizer);
    }

    function resize(e) {
        const element = document.querySelector(
            'footer > div > div:nth-child(2)',
        );
        element.style.maxHeight = '100%';
        const textelem = document.querySelector(
            'footer > div > div:nth-child(2) > div > div:nth-child(2)',
        );
        if (textelem) textelem.style.maxHeight = '100%';

        const minimum_size = 20;
        let original_height = parseFloat(
            getComputedStyle(element, null)
                .getPropertyValue('height')
                .replace('px', ''),
        );
        let original_y = element.getBoundingClientRect().top;

        const height = original_height - (e.pageY - original_mouse_y);
        original_mouse_y = e.pageY;

        if (height > minimum_size) {
            element.style.height = height + 'px';
            element.style.top =
                original_y + (e.pageY - original_mouse_y) + 'px';
        }
    }

    function stopResize() {
        window.removeEventListener('mousemove', resize);
    }

    function evMouseDown(ev) {
        ev.preventDefault();
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    function makeResizableDiv() {
        const resizers = document.getElementsByClassName('iw-resizer');

        for (let i = 0; i < resizers.length; i++) {
            const currentResizer = resizers[i];
            currentResizer.removeEventListener('mousedown', evMouseDown);
            currentResizer.addEventListener('mousedown', evMouseDown);
        }
    }

    function init() {
        let mutationObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.target.className === mutationTargetClass) {
                    if (
                        mutation.previousSibling?.className ===
                        mutataionTargetPrevSibling
                    ) {
                        prependResizer();
                        makeResizableDiv();
                    }
                }
                // console.log(mutation.target, mutation);
            });
        });

        mutationObserver.observe(
            document.getElementsByClassName(mainPaneClassName)[0],
            {
                childList: true,
                subtree: true,
            },
        );
    }

    function checkIfLoaded() {
        setTimeout(function () {
            let pane = document.getElementById('pane-side');
            if (pane != null) {
                init();
            } else {
                checkIfLoaded();
            }
        }, 800);
    }
    checkIfLoaded();
})();

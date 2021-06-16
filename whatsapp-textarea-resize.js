// ==UserScript==
// @name         Whatsapp TextArea Resize
// @namespace    https://github.com/kenng/whatsapp-chatbox-resizer
// @version      0.3
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
    const resizerSize = 10;
    let original_mouse_y = 0;

    function prependResizer() {
        const resizer = document.createElement('div');
        resizer.className = 'iw-resizer';
        resizer.style.height = `${resizerSize}px`;
        resizer.style.backgroundColor = '#ccc';
        resizer.style.cursor = 'move';
        const footer = document.getElementsByTagName('footer')[0];
        footer.prepend(resizer);
    }

    function resize(e) {
        document.body.style.cursor = 'move';
        const chatboxElem = document.querySelector(
            'footer > div > div:nth-child(2)',
        );
        chatboxElem.style.maxHeight = '100%';

        const min_height = 42;
        const original_height = parseFloat(
            getComputedStyle(chatboxElem, null)
                .getPropertyValue('height')
                .replace('px', ''),
        );
        const original_y = chatboxElem.getBoundingClientRect().top;
        const new_y = original_y - e.pageY - resizerSize;
        const height = original_height + new_y;

        if (height > min_height) {
            chatboxElem.style.height = height + 'px';
            chatboxElem.style.top = new_y + 'px';
        }
        // console.log(height, original_height, new_y, original_y, e.pageY);
    }

    function stopResize() {
        document.body.style.cursor = 'initial';
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

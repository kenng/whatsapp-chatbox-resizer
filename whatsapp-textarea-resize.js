// ==UserScript==
// @name         Whatsapp TextArea Resize
// @namespace    https://github.com/kenng/whatsapp-chatbox-resizer
// @version      0.1
// @description  resizable chatbox text area
// @author       Ken Ng
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
    'use strict';
    let original_mouse_x = 0;
    let original_mouse_y = 0;

    /*Make resizable div by Hung Nguyen*/
    function prependResizer() {
        var resizer = document.createElement('div');
        resizer.id = 'iw-resizer';
        resizer.className = 'resizer';
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
        //debugger

        const minimum_size = 20;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        original_width = parseFloat(
            getComputedStyle(element, null)
                .getPropertyValue('width')
                .replace('px', ''),
        );
        original_height = parseFloat(
            getComputedStyle(element, null)
                .getPropertyValue('height')
                .replace('px', ''),
        );
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;

        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height - (e.pageY - original_mouse_y);
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        // if (width > minimum_size) {
        //   element.style.width = width + 'px'
        // }
        if (height > minimum_size) {
            element.style.height = height + 'px';
            element.style.top =
                original_y + (e.pageY - original_mouse_y) + 'px';
        }
    }

    function stopResize() {
        window.removeEventListener('mousemove', resize);
    }

    function setChatItem() {
        let item = document.querySelectorAll(
            '#pane-side > div > div > div > div',
        );
        if (!item) setTimeout(() => setChatItem(), 3000);
        for (let d of item) {
            d.addEventListener('click', (ev) => {
                let target = ev.currentTarget;
                triggerAction(ev);
                //target.removeEventListener('click', triggerAction, true)
                //target.addEventListener('click', triggerAction, true)
            });
        }
    }

    function evMouseDown(ev) {
        ev.preventDefault();
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    function makeResizableDiv(div) {
        const resizers = [document.getElementById('iw-resizer')];

        for (let i = 0; i < resizers.length; i++) {
            const currentResizer = resizers[i];
            currentResizer.removeEventListener('mousedown', evMouseDown);
            currentResizer.addEventListener('mousedown', evMouseDown);
        }
    }

    function triggerAction() {
        prependResizer();
        makeResizableDiv('.resizable');
    }

    function initCheck() {
        let rightHandChatDiv = document.querySelector(
            'footer > div > div:nth-child(2)',
        );
        if (rightHandChatDiv) {
            prependResizer();
        }
    }

    function checkIfLoaded() {
        setTimeout(function () {
            let pane = document.getElementById('pane-side');
            if (pane != null) {
                setChatItem();
            } else {
                checkIfLoaded();
            }
        }, 800);
    }
    checkIfLoaded();
})();

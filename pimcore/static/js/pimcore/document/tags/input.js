/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2014 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.document.tags.input");
pimcore.document.tags.input = Class.create(pimcore.document.tag, {

    initialize: function(id, name, options, data, inherited) {
        this.id = id;
        this.name = name;
        this.setupWrapper();
        options = this.parseOptions(options);

        if (!data) {
            data = "";
        }

        this.element = Ext.get(id);
        this.element.dom.setAttribute("contenteditable", true);
        this.element.update(data);
        this.checkValue();

        this.element.on("keyup", this.checkValue.bind(this));
        this.element.on("keydown", function (e, t, o) {
            // do not allow certain keys, like enter, ...
            if(in_array(e.getCharCode(), [13])) {
                e.stopEvent();
            }
        });

        if(options["width"]) {
            this.element.applyStyles({
                display: "inline-block",
                width: options["width"] + "px",
                overflow: "auto",
                "white-space": "nowrap"
            });
        }
        if(options["nowrap"]) {
            this.element.applyStyles({
                "white-space": "nowrap",
                overflow: "auto"
            });
        }
    },

    checkValue: function () {
        var value = trim(this.element.dom.innerHTML);
        var origValue = value;

        // replace all but the last one // FF fix, because he needs the <br>
        value = value.replace(/<br([^>]+)?>(.)/gi, function (match, p1, p2) {
            return " " + p2;
        });
        value = strip_tags(value, "<br>");

        var textLength = trim(strip_tags(value)).length;

        if(textLength < 1) {
            this.element.addClass("empty");
            value = ""; // set to "" since it can contain an <br> at the end
        } else {
            this.element.removeClass("empty");
        }

        if(value != origValue) {
            this.element.update(value);
        }
    },

    getValue: function () {
        var value = this.element.dom.innerHTML;
        value = strip_tags(value);
        value = trim(value);
        return value;
    },

    getType: function () {
        return "input";
    }
});

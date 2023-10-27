/*! igt-media-elements - v5.4.0 - 2021-03-08 */if (typeof document !== 'undefined' && !document["registerElement"]) {
    (function () {
        var polyfill = { type: 'auto' };

        var
            // V0 polyfill entry
            REGISTER_ELEMENT = 'registerElement',

            // pseudo-random number used as expando/unique name on feature detection
            UID = window.Math.random() * 10e4 >> 0,

            // IE < 11 only + old WebKit for attributes + feature detection
            EXPANDO_UID = '__' + REGISTER_ELEMENT + UID,

            // shortcuts and costants
            ADD_EVENT_LISTENER = 'addEventListener',
            ATTACHED = 'attached',
            CALLBACK = 'Callback',
            DETACHED = 'detached',
            EXTENDS = 'extends',

            ATTRIBUTE_CHANGED_CALLBACK = 'attributeChanged' + CALLBACK,
            ATTACHED_CALLBACK = ATTACHED + CALLBACK,
            CONNECTED_CALLBACK = 'connected' + CALLBACK,
            DISCONNECTED_CALLBACK = 'disconnected' + CALLBACK,
            CREATED_CALLBACK = 'created' + CALLBACK,
            DETACHED_CALLBACK = DETACHED + CALLBACK,

            ADDITION = 'ADDITION',
            MODIFICATION = 'MODIFICATION',
            REMOVAL = 'REMOVAL',

            DOM_ATTR_MODIFIED = 'DOMAttrModified',
            DOM_CONTENT_LOADED = 'DOMContentLoaded',
            DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified',

            PREFIX_TAG = '<',
            PREFIX_IS = '=',

            // valid and invalid node names
            validName = /^[A-Z][._A-Z0-9]*-[-._A-Z0-9]*$/,
            invalidNames = [
                'ANNOTATION-XML',
                'COLOR-PROFILE',
                'FONT-FACE',
                'FONT-FACE-SRC',
                'FONT-FACE-URI',
                'FONT-FACE-FORMAT',
                'FONT-FACE-NAME',
                'MISSING-GLYPH'
            ],

            // registered types and their prototypes
            types = [],
            protos = [],

            // to query subnodes
            query = '',

            // html shortcut used to feature detect
            documentElement = document.documentElement,

            // ES5 inline helpers || basic patches
            indexOf = types.indexOf || function (v) {
                for (var i = this.length; i-- && this[i] !== v;) { }
                return i;
            },

            // other helpers / shortcuts
            OP = Object.prototype,
            hOP = OP.hasOwnProperty,
            iPO = OP.isPrototypeOf,

            defineProperty = Object.defineProperty,
            empty = [],
            gOPD = Object.getOwnPropertyDescriptor,
            gOPN = Object.getOwnPropertyNames,
            gPO = Object.getPrototypeOf,
            sPO = Object.setPrototypeOf,

            // jshint proto: true
            hasProto = !!Object.__proto__,

            // V1 helpers
            fixGetClass = false,
            DRECEV1 = '__dreCEv1',
            customElements = window.customElements,
            usableCustomElements = !/^force/.test(polyfill.type) && !!(
                customElements &&
                customElements.define &&
                customElements.get &&
                customElements.whenDefined
            ),
            Dict = Object.create || Object,
            Map = window.Map || function Map() {
                var K = [], V = [], i;
                return {
                    get: function (k) {
                        return V[indexOf.call(K, k)];
                    },
                    set: function (k, v) {
                        i = indexOf.call(K, k);
                        if (i < 0) V[K.push(k) - 1] = v;
                        else V[i] = v;
                    }
                };
            },
            Promise = window.Promise || function (fn) {
                var
                    notify = [],
                    done = false,
                    p = {
                        'catch': function () {
                            return p;
                        },
                        'then': function (cb) {
                            notify.push(cb);
                            if (done) setTimeout(resolve, 1);
                            return p;
                        }
                    }
                    ;
                function resolve(value) {
                    done = true;
                    while (notify.length) notify.shift()(value);
                }
                fn(resolve);
                return p;
            },
            justCreated = false,
            constructors = Dict(null),
            waitingList = Dict(null),
            nodeNames = new Map(),
            secondArgument = function (is) {
                return is.toLowerCase();
            },

            // used to create unique instances
            create = Object.create || function Bridge(proto) {
                // silly broken polyfill probably ever used but short enough to work
                return proto ? ((Bridge.prototype = proto), new Bridge()) : this;
            },

            // will set the prototype if possible
            // or copy over all properties
            setPrototype = sPO || (
                hasProto ?
                    function (o, p) {
                        o.__proto__ = p;
                        return o;
                    } : (
                        (gOPN && gOPD) ?
                            (function () {
                                function setProperties(o, p) {
                                    for (var
                                        key,
                                        names = gOPN(p),
                                        i = 0, length = names.length;
                                        i < length; i++
                                    ) {
                                        key = names[i];
                                        if (!hOP.call(o, key)) {
                                            defineProperty(o, key, gOPD(p, key));
                                        }
                                    }
                                }
                                return function (o, p) {
                                    do {
                                        setProperties(o, p);
                                    } while ((p = gPO(p)) && !iPO.call(p, o));
                                    return o;
                                };
                            }()) :
                            function (o, p) {
                                for (var key in p) {
                                    o[key] = p[key];
                                }
                                return o;
                            }
                    )),

            // DOM shortcuts and helpers, if any

            MutationObserver = window.MutationObserver ||
                window.WebKitMutationObserver,

            HTMLAnchorElement = window.HTMLAnchorElement,

            HTMLElementPrototype = (
                window.HTMLElement ||
                window.Element ||
                window.Node
            ).prototype,

            IE8 = !iPO.call(HTMLElementPrototype, documentElement),

            safeProperty = IE8 ? function (o, k, d) {
                o[k] = d.value;
                return o;
            } : defineProperty,

            isValidNode = IE8 ?
                function (node) {
                    return node.nodeType === 1;
                } :
                function (node) {
                    return iPO.call(HTMLElementPrototype, node);
                },

            targets = IE8 && [],

            attachShadow = HTMLElementPrototype.attachShadow,
            cloneNode = HTMLElementPrototype.cloneNode,
            closest = HTMLElementPrototype.closest || function (name) {
                var self = this;
                while (self && self.nodeName !== name)
                    self = self.parentNode;
                return self;
            },
            dispatchEvent = HTMLElementPrototype.dispatchEvent,
            getAttribute = HTMLElementPrototype.getAttribute,
            hasAttribute = HTMLElementPrototype.hasAttribute,
            removeAttribute = HTMLElementPrototype.removeAttribute,
            setAttribute = HTMLElementPrototype.setAttribute,

            // replaced later on
            createElement = document.createElement,
            importNode = document.importNode,
            patchedCreateElement = createElement,

            // shared observer for all attributes
            attributesObserver = MutationObserver && {
                attributes: true,
                characterData: true,
                attributeOldValue: true
            },

            // useful to detect only if there's no MutationObserver
            DOMAttrModified = MutationObserver || function (e) {
                doesNotSupportDOMAttrModified = false;
                documentElement.removeEventListener(
                    DOM_ATTR_MODIFIED,
                    DOMAttrModified
                );
            },

            // will both be used to make DOMNodeInserted asynchronous
            asapQueue,
            asapTimer = 0,

            // internal flags
            V0 = REGISTER_ELEMENT in document &&
                !/^force-all/.test(polyfill.type),
            setListener = true,
            justSetup = false,
            doesNotSupportDOMAttrModified = true,
            dropDomContentLoaded = true,

            // needed for the innerHTML helper
            notFromInnerHTMLHelper = true,

            // optionally defined later on
            onSubtreeModified,
            callDOMAttrModified,
            getAttributesMirror,
            observer,
            observe,

            // based on setting prototype capability
            // will check proto or the expando attribute
            // in order to setup the node once
            patchIfNotAlready,
            patch,

            // used for tests
            tmp
            ;

        // IE11 disconnectedCallback issue #
        // to be tested before any createElement patch
        if (MutationObserver) {
            // original fix:
            // https://github.com/javan/mutation-observer-inner-html-shim
            tmp = document.createElement('div');
            tmp.innerHTML = '<div><div></div></div>';
            new MutationObserver(function (mutations, observer) {
                if (
                    mutations[0] &&
                    mutations[0].type == 'childList' &&
                    !mutations[0].removedNodes[0].childNodes.length
                ) {
                    tmp = gOPD(HTMLElementPrototype, 'innerHTML');
                    var set = tmp && tmp.set;
                    if (set)
                        defineProperty(HTMLElementPrototype, 'innerHTML', {
                            set: function (value) {
                                while (this.lastChild)
                                    this.removeChild(this.lastChild);
                                set.call(this, value);
                            }
                        });
                }
                observer.disconnect();
                tmp = null;
            }).observe(tmp, { childList: true, subtree: true });
            tmp.innerHTML = "";
        }

        // only if needed
        if (!V0) {

            if (sPO || hasProto) {
                patchIfNotAlready = function (node, proto) {
                    if (!iPO.call(proto, node)) {
                        setupNode(node, proto);
                    }
                };
                patch = setupNode;
            } else {
                patchIfNotAlready = function (node, proto) {
                    if (!node[EXPANDO_UID]) {
                        node[EXPANDO_UID] = Object(true);
                        setupNode(node, proto);
                    }
                };
                patch = patchIfNotAlready;
            }

            if (IE8) {
                doesNotSupportDOMAttrModified = false;
                (function () {
                    var
                        descriptor = gOPD(HTMLElementPrototype, ADD_EVENT_LISTENER),
                        addEventListener = descriptor.value,
                        patchedRemoveAttribute = function (name) {
                            var e = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });
                            e.attrName = name;
                            e.prevValue = getAttribute.call(this, name);
                            e.newValue = null;
                            e[REMOVAL] = e.attrChange = 2;
                            removeAttribute.call(this, name);
                            dispatchEvent.call(this, e);
                        },
                        patchedSetAttribute = function (name, value) {
                            var
                                had = hasAttribute.call(this, name),
                                old = had && getAttribute.call(this, name),
                                e = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true })
                                ;
                            setAttribute.call(this, name, value);
                            e.attrName = name;
                            e.prevValue = had ? old : null;
                            e.newValue = value;
                            if (had) {
                                e[MODIFICATION] = e.attrChange = 1;
                            } else {
                                e[ADDITION] = e.attrChange = 0;
                            }
                            dispatchEvent.call(this, e);
                        },
                        onPropertyChange = function (e) {
                            // jshint eqnull:true
                            var
                                node = e.currentTarget,
                                superSecret = node[EXPANDO_UID],
                                propertyName = e.propertyName,
                                event
                                ;
                            if (superSecret.hasOwnProperty(propertyName)) {
                                superSecret = superSecret[propertyName];
                                event = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });
                                event.attrName = superSecret.name;
                                event.prevValue = superSecret.value || null;
                                event.newValue = (superSecret.value = node[propertyName] || null);
                                if (event.prevValue == null) {
                                    event[ADDITION] = event.attrChange = 0;
                                } else {
                                    event[MODIFICATION] = event.attrChange = 1;
                                }
                                dispatchEvent.call(node, event);
                            }
                        }
                        ;
                    descriptor.value = function (type, handler, capture) {
                        if (
                            type === DOM_ATTR_MODIFIED &&
                            this[ATTRIBUTE_CHANGED_CALLBACK] &&
                            this.setAttribute !== patchedSetAttribute
                        ) {
                            this[EXPANDO_UID] = {
                                className: {
                                    name: 'class',
                                    value: this.className
                                }
                            };
                            this.setAttribute = patchedSetAttribute;
                            this.removeAttribute = patchedRemoveAttribute;
                            addEventListener.call(this, 'propertychange', onPropertyChange);
                        }
                        addEventListener.call(this, type, handler, capture);
                    };
                    defineProperty(HTMLElementPrototype, ADD_EVENT_LISTENER, descriptor);
                }());
            } else if (!MutationObserver) {
                documentElement[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, DOMAttrModified);
                documentElement.setAttribute(EXPANDO_UID, 1);
                documentElement.removeAttribute(EXPANDO_UID);
                if (doesNotSupportDOMAttrModified) {
                    onSubtreeModified = function (e) {
                        var
                            node = this,
                            oldAttributes,
                            newAttributes,
                            key
                            ;
                        if (node === e.target) {
                            oldAttributes = node[EXPANDO_UID];
                            node[EXPANDO_UID] = (newAttributes = getAttributesMirror(node));
                            for (key in newAttributes) {
                                if (!(key in oldAttributes)) {
                                    // attribute was added
                                    return callDOMAttrModified(
                                        0,
                                        node,
                                        key,
                                        oldAttributes[key],
                                        newAttributes[key],
                                        ADDITION
                                    );
                                } else if (newAttributes[key] !== oldAttributes[key]) {
                                    // attribute was changed
                                    return callDOMAttrModified(
                                        1,
                                        node,
                                        key,
                                        oldAttributes[key],
                                        newAttributes[key],
                                        MODIFICATION
                                    );
                                }
                            }
                            // checking if it has been removed
                            for (key in oldAttributes) {
                                if (!(key in newAttributes)) {
                                    // attribute removed
                                    return callDOMAttrModified(
                                        2,
                                        node,
                                        key,
                                        oldAttributes[key],
                                        newAttributes[key],
                                        REMOVAL
                                    );
                                }
                            }
                        }
                    };
                    callDOMAttrModified = function (
                        attrChange,
                        currentTarget,
                        attrName,
                        prevValue,
                        newValue,
                        action
                    ) {
                        var e = {
                            attrChange: attrChange,
                            currentTarget: currentTarget,
                            attrName: attrName,
                            prevValue: prevValue,
                            newValue: newValue
                        };
                        e[action] = attrChange;
                        onDOMAttrModified(e);
                    };
                    getAttributesMirror = function (node) {
                        for (var
                            attr, name,
                            result = {},
                            attributes = node.attributes,
                            i = 0, length = attributes.length;
                            i < length; i++
                        ) {
                            attr = attributes[i];
                            name = attr.name;
                            if (name !== 'setAttribute') {
                                result[name] = attr.value;
                            }
                        }
                        return result;
                    };
                }
            }

            // set as enumerable, writable and configurable
            document[REGISTER_ELEMENT] = function registerElement(type, options) {
                upperType = type.toUpperCase();
                if (setListener) {
                    // only first time document.registerElement is used
                    // we need to set this listener
                    // setting it by default might slow down for no reason
                    setListener = false;
                    if (MutationObserver) {
                        observer = (function (attached, detached) {
                            function checkEmAll(list, callback) {
                                for (var i = 0, length = list.length; i < length; callback(list[i++])) { }
                            }
                            return new MutationObserver(function (records) {
                                for (var
                                    current, node, newValue,
                                    i = 0, length = records.length; i < length; i++
                                ) {
                                    current = records[i];
                                    if (current.type === 'childList') {
                                        checkEmAll(current.addedNodes, attached);
                                        checkEmAll(current.removedNodes, detached);
                                    } else {
                                        node = current.target;
                                        if (notFromInnerHTMLHelper &&
                                            node[ATTRIBUTE_CHANGED_CALLBACK] &&
                                            current.attributeName !== 'style') {
                                            newValue = getAttribute.call(node, current.attributeName);
                                            if (newValue !== current.oldValue) {
                                                node[ATTRIBUTE_CHANGED_CALLBACK](
                                                    current.attributeName,
                                                    current.oldValue,
                                                    newValue
                                                );
                                            }
                                        }
                                    }
                                }
                            });
                        }(executeAction(ATTACHED), executeAction(DETACHED)));
                        observe = function (node) {
                            observer.observe(
                                node,
                                {
                                    childList: true,
                                    subtree: true
                                }
                            );
                            return node;
                        };
                        observe(document);
                        if (attachShadow) {
                            HTMLElementPrototype.attachShadow = function () {
                                return observe(attachShadow.apply(this, arguments));
                            };
                        }
                    } else {
                        asapQueue = [];
                        document[ADD_EVENT_LISTENER]('DOMNodeInserted', onDOMNode(ATTACHED));
                        document[ADD_EVENT_LISTENER]('DOMNodeRemoved', onDOMNode(DETACHED));
                    }

                    document[ADD_EVENT_LISTENER](DOM_CONTENT_LOADED, onReadyStateChange);
                    document[ADD_EVENT_LISTENER]('readystatechange', onReadyStateChange);

                    document.importNode = function (node, deep) {
                        switch (node.nodeType) {
                            case 1:
                                return setupAll(document, importNode, [node, !!deep]);
                            case 11:
                                for (var
                                    fragment = document.createDocumentFragment(),
                                    childNodes = node.childNodes,
                                    length = childNodes.length,
                                    i = 0; i < length; i++
                                )
                                    fragment.appendChild(document.importNode(childNodes[i], !!deep));
                                return fragment;
                            default:
                                return cloneNode.call(node, !!deep);
                        }
                    };

                    HTMLElementPrototype.cloneNode = function (deep) {
                        return setupAll(this, cloneNode, [!!deep]);
                    };
                }

                if (justSetup) return (justSetup = false);

                if (-2 < (
                    indexOf.call(types, PREFIX_IS + upperType) +
                    indexOf.call(types, PREFIX_TAG + upperType)
                )) {
                    throwTypeError(type);
                }

                if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
                    throw new Error('The type ' + type + ' is invalid');
                }

                var
                    constructor = function () {
                        return extending ?
                            document.createElement(nodeName, upperType) :
                            document.createElement(nodeName);
                    },
                    opt = options || OP,
                    extending = hOP.call(opt, EXTENDS),
                    nodeName = extending ? options[EXTENDS].toUpperCase() : upperType,
                    upperType,
                    i
                    ;
                if (extending && -1 < (
                    indexOf.call(types, PREFIX_TAG + nodeName)
                )) {
                    throwTypeError(nodeName);
                }

                i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1;

                query = query.concat(
                    query.length ? ',' : '',
                    extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName
                );

                constructor.prototype = (
                    protos[i] = hOP.call(opt, 'prototype') ?
                        opt.prototype :
                        create(HTMLElementPrototype)
                );

                if (query.length) loopAndVerify(
                    document.querySelectorAll(query),
                    ATTACHED
                );

                constructor.prototype.constructor = { name: type };
                return constructor;
            };

            document.createElement = (patchedCreateElement = function (localName, typeExtension) {
                var
                    is = getIs(typeExtension),
                    node = is ?
                        createElement.call(document, localName, secondArgument(is)) :
                        createElement.call(document, localName),
                    name = '' + localName,
                    i = indexOf.call(
                        types,
                        (is ? PREFIX_IS : PREFIX_TAG) +
                        (is || name).toUpperCase()
                    ),
                    setup = -1 < i
                    ;
                if (is) {
                    node.setAttribute('is', is = is.toLowerCase());
                    if (setup) {
                        setup = isInQSA(name.toUpperCase(), is);
                    }
                }
                notFromInnerHTMLHelper = !document.createElement.innerHTMLHelper;
                if (setup) patch(node, protos[i]);
                return node;
            });

        }

        // needed due unbelievable IE11 behavior
        // https://github.com/WebReflection/document-register-element/issues/175#issuecomment-520904688
        addEventListener(
            'beforeunload',
            function () {
                delete document.createElement;
                delete document.importNode;
                delete document[REGISTER_ELEMENT];
            },
            false
        );

        function ASAP() {
            var queue = asapQueue.splice(0, asapQueue.length);
            asapTimer = 0;
            while (queue.length) {
                queue.shift().call(
                    null, queue.shift()
                );
            }
        }

        function loopAndVerify(list, action) {
            for (var i = 0, length = list.length; i < length; i++) {
                verifyAndSetupAndAction(list[i], action);
            }
        }

        function loopAndSetup(list) {
            for (var i = 0, length = list.length, node; i < length; i++) {
                node = list[i];
                patch(node, protos[getTypeIndex(node)]);
            }
        }

        function executeAction(action) {
            return function (node) {
                if (isValidNode(node)) {
                    verifyAndSetupAndAction(node, action);
                    if (query.length) loopAndVerify(
                        node.querySelectorAll(query),
                        action
                    );
                }
            };
        }

        function getTypeIndex(target) {
            var
                is = getAttribute.call(target, 'is'),
                nodeName = target.nodeName.toUpperCase(),
                i = indexOf.call(
                    types,
                    is ?
                        PREFIX_IS + is.toUpperCase() :
                        PREFIX_TAG + nodeName
                )
                ;
            return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
        }

        function isInQSA(name, type) {
            return -1 < query.indexOf(name + '[is="' + type + '"]');
        }

        function onDOMAttrModified(e) {
            var
                node = e.currentTarget,
                attrChange = e.attrChange,
                attrName = e.attrName,
                target = e.target,
                addition = e[ADDITION] || 2,
                removal = e[REMOVAL] || 3
                ;
            if (notFromInnerHTMLHelper &&
                (!target || target === node) &&
                node[ATTRIBUTE_CHANGED_CALLBACK] &&
                attrName !== 'style' && (
                    e.prevValue !== e.newValue ||
                    // IE9, IE10, and Opera 12 gotcha
                    e.newValue === '' && (
                        attrChange === addition ||
                        attrChange === removal
                    )
                )) {
                node[ATTRIBUTE_CHANGED_CALLBACK](
                    attrName,
                    attrChange === addition ? null : e.prevValue,
                    attrChange === removal ? null : e.newValue
                );
            }
        }

        function onDOMNode(action) {
            var executor = executeAction(action);
            return function (e) {
                asapQueue.push(executor, e.target);
                if (asapTimer) clearTimeout(asapTimer);
                asapTimer = setTimeout(ASAP, 1);
            };
        }

        function onReadyStateChange(e) {
            if (dropDomContentLoaded) {
                dropDomContentLoaded = false;
                e.currentTarget.removeEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
            }
            if (query.length) loopAndVerify(
                (e.target || document).querySelectorAll(query),
                e.detail === DETACHED ? DETACHED : ATTACHED
            );
            if (IE8) purge();
        }

        function patchedSetAttribute(name, value) {
            // jshint validthis:true
            var self = this;
            setAttribute.call(self, name, value);
            onSubtreeModified.call(self, { target: self });
        }

        function setupAll(context, callback, args) {
            var
                node = callback.apply(context, args),
                i = getTypeIndex(node)
                ;
            if (-1 < i) patch(node, protos[i]);
            if (args.pop() && query.length)
                loopAndSetup(node.querySelectorAll(query));
            return node;
        }

        function setupNode(node, proto) {
            setPrototype(node, proto);
            if (observer) {
                observer.observe(node, attributesObserver);
            } else {
                if (doesNotSupportDOMAttrModified) {
                    node.setAttribute = patchedSetAttribute;
                    node[EXPANDO_UID] = getAttributesMirror(node);
                    node[ADD_EVENT_LISTENER](DOM_SUBTREE_MODIFIED, onSubtreeModified);
                }
                node[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, onDOMAttrModified);
            }
            if (node[CREATED_CALLBACK] && notFromInnerHTMLHelper) {
                node.created = true;
                node[CREATED_CALLBACK]();
                node.created = false;
            }
        }

        function purge() {
            for (var
                node,
                i = 0,
                length = targets.length;
                i < length; i++
            ) {
                node = targets[i];
                if (!documentElement.contains(node)) {
                    length--;
                    targets.splice(i--, 1);
                    verifyAndSetupAndAction(node, DETACHED);
                }
            }
        }

        function throwTypeError(type) {
            throw new Error('A ' + type + ' type is already registered');
        }

        function verifyAndSetupAndAction(node, action) {
            var
                fn,
                i = getTypeIndex(node),
                counterAction
                ;
            if ((-1 < i) && !closest.call(node, 'TEMPLATE')) {
                patchIfNotAlready(node, protos[i]);
                i = 0;
                if (action === ATTACHED && !node[ATTACHED]) {
                    node[DETACHED] = false;
                    node[ATTACHED] = true;
                    counterAction = 'connected';
                    i = 1;
                    if (IE8 && indexOf.call(targets, node) < 0) {
                        targets.push(node);
                    }
                } else if (action === DETACHED && !node[DETACHED]) {
                    node[ATTACHED] = false;
                    node[DETACHED] = true;
                    counterAction = 'disconnected';
                    i = 1;
                }
                if (i && (fn = (
                    node[action + CALLBACK] ||
                    node[counterAction + CALLBACK]
                ))) fn.call(node);
            }
        }

        // V1 in da House!
        function CustomElementRegistry() { }

        CustomElementRegistry.prototype = {
            constructor: CustomElementRegistry,
            // a workaround for the stubborn WebKit
            define: usableCustomElements ?
                function (name, Class, options) {
                    if (options) {
                        CERDefine(name, Class, options);
                    } else {
                        var NAME = name.toUpperCase();
                        constructors[NAME] = {
                            constructor: Class,
                            create: [NAME]
                        };
                        nodeNames.set(Class, NAME);
                        customElements.define(name, Class);
                    }
                } :
                CERDefine,
            get: usableCustomElements ?
                function (name) {
                    return customElements.get(name) || get(name);
                } :
                get,
            whenDefined: usableCustomElements ?
                function (name) {
                    return Promise.race([
                        customElements.whenDefined(name),
                        whenDefined(name)
                    ]);
                } :
                whenDefined
        };

        function CERDefine(name, Class, options) {
            var
                is = options && options[EXTENDS] || '',
                CProto = Class.prototype,
                proto = create(CProto),
                attributes = Class.observedAttributes || empty,
                definition = { prototype: proto }
                ;
            // TODO: is this needed at all since it's inherited?
            // defineProperty(proto, 'constructor', {value: Class});
            safeProperty(proto, CREATED_CALLBACK, {
                value: function () {
                    if (justCreated) justCreated = false;
                    else if (!this[DRECEV1]) {
                        this[DRECEV1] = true;
                        new Class(this);
                        if (CProto[CREATED_CALLBACK])
                            CProto[CREATED_CALLBACK].call(this);
                        var info = constructors[nodeNames.get(Class)];
                        if (!usableCustomElements || info.create.length > 1) {
                            notifyAttributes(this);
                        }
                    }
                }
            });
            safeProperty(proto, ATTRIBUTE_CHANGED_CALLBACK, {
                value: function (name) {
                    if (-1 < indexOf.call(attributes, name)) {
                        if (CProto[ATTRIBUTE_CHANGED_CALLBACK])
                            CProto[ATTRIBUTE_CHANGED_CALLBACK].apply(this, arguments);
                    }
                }
            });
            if (CProto[CONNECTED_CALLBACK]) {
                safeProperty(proto, ATTACHED_CALLBACK, {
                    value: CProto[CONNECTED_CALLBACK]
                });
            }
            if (CProto[DISCONNECTED_CALLBACK]) {
                safeProperty(proto, DETACHED_CALLBACK, {
                    value: CProto[DISCONNECTED_CALLBACK]
                });
            }
            if (is) definition[EXTENDS] = is;
            name = name.toUpperCase();
            constructors[name] = {
                constructor: Class,
                create: is ? [is, secondArgument(name)] : [name]
            };
            nodeNames.set(Class, name);
            document[REGISTER_ELEMENT](name.toLowerCase(), definition);
            whenDefined(name);
            waitingList[name].r();
        }

        function get(name) {
            var info = constructors[name.toUpperCase()];
            return info && info.constructor;
        }

        function getIs(options) {
            return typeof options === 'string' ?
                options : (options && options.is || '');
        }

        function notifyAttributes(self) {
            var
                callback = self[ATTRIBUTE_CHANGED_CALLBACK],
                attributes = callback ? self.attributes : empty,
                i = attributes.length,
                attribute
                ;
            while (i--) {
                attribute = attributes[i]; // || attributes.item(i);
                callback.call(
                    self,
                    attribute.name || attribute.nodeName,
                    null,
                    attribute.value || attribute.nodeValue
                );
            }
        }

        function whenDefined(name) {
            name = name.toUpperCase();
            if (!(name in waitingList)) {
                waitingList[name] = {};
                waitingList[name].p = new Promise(function (resolve) {
                    waitingList[name].r = resolve;
                });
            }
            return waitingList[name].p;
        }

        function polyfillV1() {
            if (customElements) delete window.customElements;
            defineProperty(window, 'customElements', {
                configurable: true,
                value: new CustomElementRegistry()
            });
            defineProperty(window, 'CustomElementRegistry', {
                configurable: true,
                value: CustomElementRegistry
            });
            for (var
                patchClass = function (name) {
                    var Class = window[name];
                    if (Class) {
                        window[name] = function CustomElementsV1(self) {
                            var info, isNative;
                            if (!self) self = this;
                            if (!self[DRECEV1]) {
                                justCreated = true;
                                info = constructors[nodeNames.get(self.constructor)];
                                isNative = usableCustomElements && info.create.length === 1;
                                self = isNative ?
                                    Reflect.construct(Class, empty, info.constructor) :
                                    document.createElement.apply(document, info.create);
                                self[DRECEV1] = true;
                                justCreated = false;
                                if (!isNative) notifyAttributes(self);
                            }
                            return self;
                        };
                        window[name].prototype = Class.prototype;
                        try {
                            Class.prototype.constructor = window[name];
                        } catch (WebKit) {
                            fixGetClass = true;
                            defineProperty(Class, DRECEV1, { value: window[name] });
                        }
                    }
                },
                Classes = htmlClass.get(/^HTML[A-Z]*[a-z]/),
                i = Classes.length;
                i--;
                patchClass(Classes[i])
            ) { }
            (document.createElement = function (name, options) {
                var is = getIs(options);
                return is ?
                    patchedCreateElement.call(this, name, secondArgument(is)) :
                    patchedCreateElement.call(this, name);
            });
            if (!V0) {
                justSetup = true;
                document[REGISTER_ELEMENT]('');
            }
        }

        // if customElements is not there at all
        if (!customElements || /^force/.test(polyfill.type)) polyfillV1();
        else if (!polyfill.noBuiltIn) {
            // if available test extends work as expected
            try {
                (function (DRE, options, name) {
                    var re = new RegExp('^<a\\s+is=(\'|")' + name + '\\1></a>$');
                    options[EXTENDS] = 'a';
                    DRE.prototype = create(HTMLAnchorElement.prototype);
                    DRE.prototype.constructor = DRE;
                    window.customElements.define(name, DRE, options);
                    if (
                        !re.test(document.createElement('a', { is: name }).outerHTML) ||
                        !re.test((new DRE()).outerHTML)
                    ) {
                        throw options;
                    }
                }(
                    function DRE() {
                        return Reflect.construct(HTMLAnchorElement, [], DRE);
                    },
                    {},
                    'document-register-element-a' + UID
                ));
            } catch (o_O) {
                // or force the polyfill if not
                // and keep internal original reference
                polyfillV1();
            }
        }

        // FireFox only issue
        if (!polyfill.noBuiltIn) {
            try {
                if (createElement.call(document, 'a', 'a').outerHTML.indexOf('is') < 0)
                    throw {};
            } catch (FireFox) {
                secondArgument = function (is) {
                    return { is: is.toLowerCase() };
                };
            }
        }
    })()
}
// ---- igt-media-elements library ----
// Provides custom html elements for creating content using Media Manager provided data.
"use strict";

var webWorker = false;

if (typeof window === 'undefined' || typeof document == 'undefined') {
    webWorker = true;
}

/**
 * IGTMediaElements constructor
 * @constructor
 */
var IGTMediaElements = function (IGTMediaElements) {
    // Object which simulates a switch statement
    var processWindowEvent = {};

    var gameplayIdleElements = [];
    var gameplayActiveElements = [];

    //observables
    IGTMediaElements.tokenSubscribers = new Map();
    IGTMediaElements.levelUpdateSubscribers = new Map();
    IGTMediaElements.screenTriggerSubscribers = new Map();
    IGTMediaElements.allScreenTriggersSubscribersCallback = function () {};

    //elements and pub sub topic names
    var IGT_TOKEN_UPDATE = "igt-token-update";
    var IGT_SCREEN_TRIGGER = "igt-screen-trigger";
    var IGT_PATRON_RANKING = "igt-patron-ranking";
    var IGT_MEDIA = "igt-media";
    var IGT_PIN_VERIFY = "igt-pin-verify";
    var IGT_CASHLESS_TRANSFER = "igt-cashless-transfer";
    var IGT_CASHLESS_STATUS = "igt-cashless-status";
    IGTMediaElements.IGT_PIN_VERIFIED_TOPIC = "igt-pin-verified_topic";
    IGTMediaElements.IGT_PIN_NOT_VERIFIED_TOPIC = "igt-pin-not-verified_topic";
    var IGT_XC_ENABLED_TOPIC = "igt-xc-enabled_topic";
    var IGT_XC_NOT_ENABLED_TOPIC = "igt-xc-not-enabled_topic";
    var IGT_XC_ACTIVATE = "igt-xc-activate";
    var IGT_XC_ACTIVATED = "igt-xc-activated";
    var IGT_XC_ACTIVATED_TOPIC = "igt-xc-activated_topic";
    var IGT_XC_NOT_ACTIVATED_TOPIC = "igt-xc-not-activated_topic";
    var IGT_XC_STATUS = "igt-xc-status";
    var IGT_XC_CANCELED_TOPIC = "igt-xc-canceled_topic";
    var IGT_XC_CANCELABLE_TOPIC = "igt-xc-cancelable_topic";
    var IGT_XC_NOT_CANCELED_TOPIC = "igt-xc-not-canceled_topic";
    var IGT_PP_ENABLED_TOPIC = "igt-pp-enabled_topic";
    var IGT_PP_NOT_ENABLED_TOPIC = "igt-pp-not-enabled_topic";
    var IGT_PP_SHOW = "igt-pp-show";
    IGTMediaElements.IGT_PP_SHOWN_TOPIC = "igt-pp-shown_topic";
    IGTMediaElements.IGT_PP_NOT_SHOWN_TOPIC = "igt-pp-not-shown_topic";
    var IGT_PP_CONVERT = "igt-pp-convert";
    var IGT_PP_CONVERT_TOPIC = "igt-pp-convert_topic";
    var IGT_PP_CONVERTED_TOPIC = "igt-pp-converted_topic";
    IGTMediaElements.IGT_PP_CANCEL_CONVERT_TOPIC = "igt-pp-cancel-convert_topic";
    var IGT_PP_NOT_CONVERTED_TOPIC = "igt-pp-not-converted_topic";
    var IGT_PP_STATUS = "igt-pp-status";
    var IGT_PP_POINTS = "igt-pp-points";
    IGTMediaElements.IGT_PP_POINTS_TOPIC = "igt-pp-points_topic";
    var IGT_LEVEL_UPDATE = "igt-level-update";
    var GET_TOKENS_RESPONSE_TOPIC = "getTokensResponse_topic";
    IGTMediaElements.GET_CURRENT_TOKEN_VALUE_RESPONSE_TOPIC = "getCurrentTokenValueResponse_topic";
    IGTMediaElements.GET_LEVEL_UPDATE_RESPONSE_TOPIC = "getLevelUpdateResponse_topic";
    IGTMediaElements.GET_PATRON_DATA_RESPONSE_TOPIC = "getPatronDataResponse_topic";
    IGTMediaElements.GET_PATRON_DATA_EXT_RESPONSE_TOPIC = "getPatronDataExtResponse_topic";
    IGTMediaElements.WINDOW_STATE_TOPIC = "windowState_topic";
    var IGT_CASHLESS_TRANSFER_TOPIC = "igt-cashless-transfer_topic";
    var IGT_CASHLESS_STATUS_TOPIC = "igt-cashless-status_topic";
    var IGT_GAMEPLAY_IDLE = 'igt-gameplay-idle';
    IGTMediaElements.IGT_GAMEPLAY_IDLE_TOPIC = 'igt-gameplay-idle-topic';
    var IGT_GAMEPLAY_ACTIVE = 'igt-gameplay-active';
    IGTMediaElements.IGT_GAMEPLAY_ACTIVE_TOPIC = 'igt-gameplay-active-topic';

    //Flag to convert Point to Extra Credit or Credit
    IGTMediaElements.convertPointsToCredits = false;

    //Flag for checking if XTraCredit has already been activated.
    var isXtraCreditAlreadyActive = false;

    //Flag for responding to XtraCredit workflow responses.
    var isXtraCreditConstructed = false;

    //User selected Point Play Amount
    IGTMediaElements.pointsToCredits = 0;

    //Point Play Balance
    IGTMediaElements.playerPointBalance = 0;

    //Default Xtra Credit Name
    IGTMediaElements.xtraCreditDefaultName = "Xtra Credit";
    //Custom Xtra Credit Name
    IGTMediaElements.xtraCreditCustomName = IGTMediaElements.xtraCreditDefaultName;

    //Default Cashless Name
    IGTMediaElements.cashlessDefaultName = "Cashless";
    //Custom Cashless Name
    IGTMediaElements.cashlessCustomName = IGTMediaElements.cashlessDefaultName;

    //statuses
    IGTMediaElements.statuses = {};

    //Patron Id
    IGTMediaElements.patronId = "";

    //Supported Disabled Elements per W3
    IGTMediaElements.supportedDisableElements = ["BUTTON", "FIELDSET", "INPUT", "OPTGROUP", "OPTION", "SELECT", "TEXTAREA"];

    /**
     * Notify Subscriber
     * @param subscriberCallback {Function} The subscribers callback function to be called
     * @param value {Object} Value of the subscribed event
     */
    var notifySubscriber = function notifySubscriber(subscriberCallback, value) {
        if (subscriberCallback !== undefined && typeof subscriberCallback === "function") {
            subscriberCallback(value);
        }
    };

    /**
     * Enable Xtra Credit
     */
    var enableXtraCredit = function enableXtraCredit() {
        if (isXtraCreditConstructed) {
            IGTMediaElements.util.sendMessage({ "cmd": "enableXtraCredit", "ver": "1.0" });
        }
    };

    /**
     * Enable Point Play
     */
    var enablePointPlay = function enablePointPlay() {
        IGTMediaElements.pointPlay.isEnabled().then(function (data) {
            IGTMediaElements.pubSub.publish("igt-pp-enable-response", data);

            if (data.pointPlayEnabled) {
                IGTMediaElements.pubSub.publish(IGT_PP_ENABLED_TOPIC, data);
            } else {
                IGTMediaElements.pubSub.publish(IGT_PP_NOT_ENABLED_TOPIC, data);
            }
        });
    };

    /**
     * Receive postMessages from Shell
     */
    var receiveWindowEvent = function receiveWindowEvent(e) {
        var data = e.data;

        var callback = void 0;

        if (data.cmd) {
            callback = processWindowEvent[data.cmd];
        }

        if (callback === undefined) {
            processWindowEvent.default(data);
        } else {
            callback(data);
        }
    };

    processWindowEvent.default = function (data) {
        IGTMediaElements.pubSub.publish("igt-unknown-event", data);
    };

    processWindowEvent.screenTrigger = function (data) {
        IGTMediaElements.pubSub.publish(IGT_SCREEN_TRIGGER + "-" + data.screenTrigger.screenId, data.screenTrigger.displayMessage);
        notifySubscriber(IGTMediaElements.screenTriggerSubscribers.get(data.screenTrigger.screenId), data.screenTrigger.displayMessage);

        if (typeof IGTMediaElements.allScreenTriggersSubscribersCallback === 'function') {
            notifySubscriber(IGTMediaElements.allScreenTriggersSubscribersCallback, {
                "screenId": data.screenTrigger.screenId,
                "displayMessage": data.screenTrigger.displayMessage

            });
        }

        if (data.screenTrigger.screenId === "0x80") {
            //Reset the patronId on card-out.
            IGTMediaElements.patronId = "";
        }
    };

    processWindowEvent.tokenUpdate = function (data) {
        for (var i = 0; i < data.tokenUpdate.length; i++) {
            if (data.tokenUpdate[i].value !== "Unk Tok") {
                IGTMediaElements.pubSub.publish(IGT_TOKEN_UPDATE + "-" + data.tokenUpdate[i].id, data.tokenUpdate[i].value);
                notifySubscriber(IGTMediaElements.tokenSubscribers.get(data.tokenUpdate[i].id), data.tokenUpdate[i].value);

                if (data.tokenUpdate[i].id === "0x45") {
                    //Cache the patronId.
                    IGTMediaElements.patronId = data.tokenUpdate[i].value;
                }
            }
        }
    };

    processWindowEvent.levelUpdate = function (data) {
        for (var i = 0; i < data.levelUpdate.length; i++) {
            IGTMediaElements.pubSub.publish(IGT_LEVEL_UPDATE + "-" + data.levelUpdate[i].bonusId, data.levelUpdate[i]);
            notifySubscriber(IGTMediaElements.levelUpdateSubscribers.get(data.levelUpdate[i].bonusId), data.levelUpdate[i]);
            IGTMediaElements.pubSub.publish(IGT_LEVEL_UPDATE + "-" + data.levelUpdate[i].levelName, data.levelUpdate[i]);
            notifySubscriber(IGTMediaElements.levelUpdateSubscribers.get(data.levelUpdate[i].levelName), data.levelUpdate[i]);
        }
    };

    processWindowEvent.patronDataExt = function (data) {
        IGTMediaElements.pubSub.publish(IGT_PATRON_RANKING, data);

        if (data.patronDataExt) {
            IGTMediaElements.pubSub.publish(IGT_PATRON_RANKING + "-" + data.patronDataExt.playerRankIndex, data.patronDataExt.playerRankIndex);
        }
    };

    processWindowEvent.validatePINResp = function (data) {
        if (data.status === 1) {
            IGTMediaElements.pubSub.publish(IGTMediaElements.IGT_PIN_VERIFIED_TOPIC, {
                status: data.status,
                message: IGTMediaElements.statuses.pin.validate[data.status]
            });
        } else {
            IGTMediaElements.pubSub.publish(IGTMediaElements.IGT_PIN_NOT_VERIFIED_TOPIC, {
                status: data.status,
                message: IGTMediaElements.statuses.pin.validate[data.status]
            });
        }
    };

    processWindowEvent.isXtraCreditActiveResp = function (data) {
        //Check the response msg if XTraCredit is already activated.
        if (data.xtraCreditActive) {
            isXtraCreditAlreadyActive = true;

            //Get the callback that handles the response msg.
            var handlerCb = processWindowEvent.activateXtraCreditResp;

            //XtraCredit has already been activated so we IGTMediaElements.broadcast the topic again to have
            //elements in the correct display state.
            handlerCb(data.xtraCreditRespMsg);
        } else {
            isXtraCreditAlreadyActive = false;

            //Only post msg to XtraCredit service if XTraCredit has not been activated.
            enableXtraCredit();
        }
    };

    processWindowEvent.enableXtraCreditResp = function (data) {
        IGTMediaElements.pubSub.publish("igt-xc-enable-response", data);

        if (!isXtraCreditAlreadyActive) {
            if (data.xtraCreditEnabled) {
                IGTMediaElements.pubSub.publish(IGT_XC_ENABLED_TOPIC, data);
            } else {
                IGTMediaElements.pubSub.publish(IGT_XC_NOT_ENABLED_TOPIC, data);
            }
        }
    };

    processWindowEvent.activateXtraCreditResp = function (data) {
        IGTMediaElements.pubSub.publish("igt-xc-activate-response", data);

        //XC Protection for cases where statuses message was not available in the IGT Media Elements from the Shell
        if (!IGTMediaElements.statuses.hasOwnProperty('xtraCredit')) {
            IGTMediaElements.statuses.xtraCredit = { activate: {} };
            IGTMediaElements.statuses.xtraCredit.activate[data.status] = data.statusMessage;
        }

        if (data.status === 0 || data.status === 2) {
            IGTMediaElements.pubSub.publish(IGT_XC_ACTIVATED_TOPIC, {
                status: data.status,
                message: IGTMediaElements.statuses.xtraCredit.activate[data.status]
            });
        } else if (data.status === 1) {
            IGTMediaElements.pubSub.publish(IGT_XC_ACTIVATED_TOPIC, {
                status: data.status,
                message: IGTMediaElements.statuses.xtraCredit.activate[data.status]
            });

            IGTMediaElements.pubSub.publish(IGT_XC_CANCELABLE_TOPIC, { cancelable: false });
        } else {
            IGTMediaElements.pubSub.publish(IGT_XC_NOT_ACTIVATED_TOPIC, {
                status: data.status,
                message: IGTMediaElements.statuses.xtraCredit.activate[data.status]
            });
        }
    };

    processWindowEvent.cancelXtraCreditResp = function (data) {
        if (data.status !== 1) {
            isXtraCreditAlreadyActive = false;
        }
        IGTMediaElements.pubSub.publish("igt-xc-cancel-response", data);

        if (data.status === 0) {
            IGTMediaElements.pubSub.publish(IGT_XC_CANCELED_TOPIC, {
                //mapped to a single enum list for a single html status element
                status: data.status + Object.keys(IGTMediaElements.statuses.xtraCredit.activate).length,
                message: IGTMediaElements.statuses.xtraCredit.cancel[data.status]
            });
        } else {
            IGTMediaElements.pubSub.publish(IGT_XC_NOT_CANCELED_TOPIC, {
                //mapped to a single enum list for a single html status element
                status: data.status + Object.keys(IGTMediaElements.statuses.xtraCredit.activate).length,
                message: IGTMediaElements.statuses.xtraCredit.cancel[data.status]
            });
        }
    };

    processWindowEvent.getTokensResponse = function (data) {
        IGTMediaElements.pubSub.publish(GET_TOKENS_RESPONSE_TOPIC, data);
    };

    processWindowEvent.getCurrentTokenValueResponse = function (data) {
        IGTMediaElements.pubSub.publish(IGTMediaElements.GET_CURRENT_TOKEN_VALUE_RESPONSE_TOPIC, data);
    };

    processWindowEvent.getLevelUpdateResponse = function (data) {
        IGTMediaElements.pubSub.publish(IGTMediaElements.GET_LEVEL_UPDATE_RESPONSE_TOPIC, data);
    };

    processWindowEvent.getPatronDataResponse = function (data) {
        IGTMediaElements.pubSub.publish(IGTMediaElements.GET_PATRON_DATA_RESPONSE_TOPIC, data);
    };

    processWindowEvent.getPatronDataExtResponse = function (data) {
        IGTMediaElements.pubSub.publish(IGTMediaElements.GET_PATRON_DATA_EXT_RESPONSE_TOPIC, data);
    };

    processWindowEvent.windowState = function (data) {
        IGTMediaElements.pubSub.publish(IGTMediaElements.WINDOW_STATE_TOPIC, data);
    };

    processWindowEvent.checkCashlessEnabledResp = function (data) {
        if (data.enabled) {
            IGTMediaElements.pubSub.publish(IGT_CASHLESS_TRANSFER_TOPIC, data);
        }
    };

    processWindowEvent.initiateTransferResp = function (data) {
        IGTMediaElements.pubSub.publish(IGT_CASHLESS_STATUS_TOPIC, {
            status: data.transferData.status,
            message: IGTMediaElements.statuses.cashless.transfer[data.transferData.status]
        });
    };

    /**
     * Sets the default log level
     * @param data
     */
    processWindowEvent.setLogLevel = function (data) {
        IGTMediaElements.util.log.logLevel = data.logLevel;
    };

    /**
     * Element Callback igt-media-element
     * @param eventCallback {Object} callback event
     * @param idList {Array} Array of media Ids
     */
    IGTMediaElements.subscribeMediaElement = function (eventCallback, idList) {
        //subscribe for events
        for (var i = 0; i < idList.length; i++) {
            if (this.constructor.name === "igt-media") {
                //map friendly name to hexcode code
                for (var name in IGTMediaElements.names) {
                    if (name === idList[i].trim()) {
                        IGTMediaElements.pubSub.subscribe(IGTMediaElements.names[idList[i]], eventCallback);
                    }
                }
            } else if (this.constructor.name === IGT_TOKEN_UPDATE || this.constructor.name === IGT_SCREEN_TRIGGER) {
                //normalize hexcode
                IGTMediaElements.pubSub.subscribe(this.constructor.name + "-" + idList[i].trim().normalizeId(), eventCallback);
            } else {
                IGTMediaElements.pubSub.subscribe(this.constructor.name + "-" + idList[i].trim(), eventCallback);
            }
        }
    };

    /**
     * Show Element (igt-media-element)
     * @param data {Object} Original event which includes details used to modify the DOM
     */
    var showMediaElement = function showMediaElement(data) {
        if (this.constructor.name === IGT_XC_ACTIVATED && IGTMediaElements.convertPointsToCredits) {
            return;
        }

        if (this.style.display === "none") {
            if (!this.getAttribute("overridden")) {
                this.innerHTML = data;
            }

            this.style.display = "inherit";

            //get and call custom show function
            var showFunction = this.getAttribute("onshow");

            if (showFunction) {
                showFunction = window[showFunction.toString().replace("()", "").replace(";", "")];

                if (typeof showFunction === "function") {
                    showFunction();
                }
            }
        } else if (!this.getAttribute("overridden")) {
            this.innerHTML = data;
        }
    };

    /**
     * Hide Element (igt-media-element)
     */
    var hideMediaElement = function hideMediaElement() {
        //ensure xc isn't hidden if point play is converted to credits
        if ((this.constructor.name === IGT_XC_ACTIVATE || this.constructor.name === IGT_XC_ACTIVATED) && IGTMediaElements.convertPointsToCredits) {
            return;
        }

        if (this.style.display !== "none") {
            if (!this.getAttribute("overridden")) {
                this.innerHTML = null;
            }

            this.style.display = "none";

            //get and call custom hide function
            var hideFunction = this.getAttribute("onhide");

            if (hideFunction) {
                hideFunction = window[hideFunction.toString().replace("()", "").replace(";", "")];

                if (typeof hideFunction === "function") {
                    hideFunction();
                }
            }
        }
    };

    /**
     * Show Status Element
     * @param data {Object} Original event which includes details used to modify the DOM
     */
    var showStatusElement = function showStatusElement(data) {
        if (this.style.display === "none") {
            //Don't show the element if status is provided and doesn't match the current status.
            var status = this.getAttribute("status");

            if (status) {
                var statusList = status.split(",");
                var match = false;
                for (var i = 0; i < statusList.length; i++) {
                    if (data.status == statusList[i].trim()) {
                        match = true;
                    }
                }

                if (!match) {
                    return;
                }
            }

            var showInnerText = true;

            if (this.constructor.name === IGT_XC_STATUS && isXtraCreditAlreadyActive) {
                //Since XtraCredit is already activated we don't show the status text again because
                //the topic is just being re-IGTMediaElements.broadcast again to get the elements in the correct display state.

                showInnerText = false;
            }

            if (!this.getAttribute("overridden") && showInnerText) {
                this.innerHTML = data.message;
            }

            //get timeout custom attribute
            var timeout = this.getAttribute("timeout") || 5000;

            //Just hide the igt-xc-status element right away if XTraCredit is already active.
            if (isXtraCreditAlreadyActive && this.constructor.name === IGT_XC_STATUS) {
                timeout = 0;
            }

            window.setTimeout(hideMediaElement.bind(this, this.onhidden), timeout);

            this.style.display = "inherit";

            //get and call custom show function
            var showFunction = this.getAttribute("onshow");

            if (showFunction) {
                showFunction = window[showFunction.toString().replace("()", "").replace(";", "")];

                if (typeof showFunction === "function") {
                    showFunction();
                }
            }
        } else if (!this.getAttribute("overridden")) {
            this.innerHTML = data.message;
        }
    };

    /**
     * Helper function that traverses a list of children elements and adjusts disabled status or visibility based on
     * hideElements
     * @param childrenToAdjust Object[] array of child elements
     * @param hideElements {boolean} if true set nondisable elements to hidden and disabled elements to disabled.
     *                               if false set nondisable elements to visible and disabled elements to not disabled.
     */

    var setGameplayElements = function setGameplayElements(childrenToAdjust, hideElements) {
        var nonDisabled = void 0;
        for (var adjustElem in childrenToAdjust) {
            if (!childrenToAdjust.hasOwnProperty(adjustElem)) {
                return;
            }

            nonDisabled = true;

            for (var elemCompare in IGTMediaElements.supportedDisableElements) {
                if (IGTMediaElements.supportedDisableElements.hasOwnProperty(elemCompare) && childrenToAdjust[adjustElem].nodeName === IGTMediaElements.supportedDisableElements[elemCompare]) {
                    nonDisabled = false;
                    break;
                }
            }

            if (nonDisabled && childrenToAdjust[adjustElem].style !== undefined) {
                if (hideElements) {
                    childrenToAdjust[adjustElem].style.visibility = "hidden";
                } else {
                    childrenToAdjust[adjustElem].style.visibility = "visible";
                }
            } else {
                if (hideElements) {
                    childrenToAdjust[adjustElem].setAttribute("disabled", true);
                } else {
                    childrenToAdjust[adjustElem].removeAttribute("disabled");
                }
            }
        }
    };

    /**
     * Callback function to configure a new element
     */
    var configElement = function configElement() {
        //default to not display element
        this.style.display = "none";

        //flag content which has been overridden
        if (this.hasChildNodes() && this.innerHTML.replace(/\s/g, "").length !== 0) {
            this.setAttribute("overridden", "true");
        }
    };

    /**
     * Callback function to configure a new media related element
     */
    var configMediaElement = function configMediaElement() {
        //get custom attributes
        this.show = this.getAttribute("show");
        this.hide = this.getAttribute("hide");

        //add event listeners
        if (this.show) {
            IGTMediaElements.subscribeMediaElement.call(this, showMediaElement.bind(this), this.show.split(","));
        }

        if (this.hide) {
            IGTMediaElements.subscribeMediaElement.call(this, hideMediaElement.bind(this), this.hide.split(","));
        }
    };

    /**
     * Callback function to configure a new media related element
     */
    var configLevelUpdate = function configLevelUpdate() {
        //get bonusId(s) or levelName(s)
        this.bonusId = this.getAttribute("bonusid");
        this.levelName = this.getAttribute("levelname");

        //add event listeners
        if (this.bonusId) {
            IGTMediaElements.subscribeMediaElement.call(this, showMediaElement.bind(this), this.bonusId.split(","));
            IGTMediaElements.subscribeMediaElement.call(this, IGTMediaElements.emitLevelUpdate.bind(this), this.bonusId.split(","));
        }

        if (this.levelName) {
            IGTMediaElements.subscribeMediaElement.call(this, showMediaElement.bind(this), this.levelName.split(","));
            IGTMediaElements.subscribeMediaElement.call(this, IGTMediaElements.emitLevelUpdate.bind(this), this.levelName.split(","));
        }
    };

    /**
     * Callback function to prep an element to disable or enable based on game start and stop events
     */
    var configGameplayIdle = function configGameplayIdle() {

        var index = gameplayIdleElements.length;
        gameplayIdleElements.push(this);

        IGTMediaElements.game.subscribeGameStart(function (gameStart) {
            if (gameStart) {
                setGameplayElements(gameplayIdleElements[index].children, true);
            }
        });
        IGTMediaElements.game.subscribeGameEnd(function (gameEnd) {
            if (gameEnd) {
                setGameplayElements(gameplayIdleElements[index].children, false);
            }
        });
    };

    /**
     * Callback function to prep an element to disable or enable based on game start and stop events
     */
    var configGameplayActive = function configGameplayActive() {
        var index = gameplayActiveElements.length;

        gameplayActiveElements.push(this);
        //we want to call the set gameplay element once and treat these as if on load we reciev an idle game event
        setGameplayElements(gameplayActiveElements[index].children, true);
        IGTMediaElements.game.subscribeGameStart(function (gameStart) {
            if (gameStart) {
                setGameplayElements(gameplayActiveElements[index].children, false);
            }
        });
        IGTMediaElements.game.subscribeGameEnd(function (gameEnd) {
            if (gameEnd) {
                setGameplayElements(gameplayActiveElements[index].children, true);
            }
        });
    };

    /**
     * Callback function to configure a new core feature related element
     */
    var configFeatureElement = function configFeatureElement() {
        //workflow state
        switch (this.constructor.name) {
            case IGT_PIN_VERIFY:
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PIN_VERIFIED_TOPIC, showMediaElement.bind(this));
                break;
            case IGT_XC_ACTIVATE:
                IGTMediaElements.pubSub.subscribe(IGT_XC_ENABLED_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_XC_CANCELED_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_XC_ACTIVATED_TOPIC, hideMediaElement.bind(this));
                //nexgen doesn't report xc credit active during PP conversion so active the element by default and validate it wasn't converted to points in showMediaElement method.
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERTED_TOPIC, hideMediaElement.bind(this));
                break;
            case IGT_XC_ACTIVATED:
                IGTMediaElements.pubSub.subscribe(IGT_XC_ACTIVATED_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_XC_CANCELED_TOPIC, hideMediaElement.bind(this));
                //nexgen doesn't report xc credit active during PP conversion so active the element by default and validate it wasn't converted to points in showMediaElement method.
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERTED_TOPIC, showMediaElement.bind(this));
                break;
            case IGT_XC_STATUS:
                IGTMediaElements.pubSub.subscribe(IGT_XC_ACTIVATED_TOPIC, showStatusElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_XC_NOT_ACTIVATED_TOPIC, showStatusElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_XC_CANCELED_TOPIC, showStatusElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_XC_NOT_CANCELED_TOPIC, showStatusElement.bind(this));
                break;
            case IGT_PP_SHOW:
                IGTMediaElements.pubSub.subscribe(IGT_PP_ENABLED_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERT_TOPIC, hideMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERTED_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_CANCEL_CONVERT_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_SHOWN_TOPIC, hideMediaElement.bind(this));
                break;
            case IGT_PP_CONVERT:
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_SHOWN_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_NOT_SHOWN_TOPIC, hideMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERTED_TOPIC, hideMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_CANCEL_CONVERT_TOPIC, hideMediaElement.bind(this));
                break;
            case IGT_PP_STATUS:
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_NOT_SHOWN_TOPIC, showStatusElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERTED_TOPIC, showStatusElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_CANCEL_CONVERT_TOPIC, hideMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_PP_NOT_CONVERTED_TOPIC, showStatusElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PIN_NOT_VERIFIED_TOPIC, showStatusElement.bind(this));
                break;
            case IGT_PP_POINTS:
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_POINTS_TOPIC, showMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_NOT_SHOWN_TOPIC, hideMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGT_PP_CONVERTED_TOPIC, hideMediaElement.bind(this));
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PP_CANCEL_CONVERT_TOPIC, hideMediaElement.bind(this));
                break;
            case IGT_CASHLESS_TRANSFER:
                IGTMediaElements.pubSub.subscribe(IGT_CASHLESS_TRANSFER_TOPIC, showMediaElement.bind(this));
                break;
            case IGT_CASHLESS_STATUS:
                IGTMediaElements.pubSub.subscribe(IGT_CASHLESS_STATUS_TOPIC, showStatusElement.bind(this));
                break;
            case IGT_GAMEPLAY_IDLE:
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_GAMEPLAY_IDLE_TOPIC, configGameplayIdle.bind(this));
                break;
            case IGT_GAMEPLAY_ACTIVE:
                IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_GAMEPLAY_ACTIVE_TOPIC, configGameplayActive.bind(this));
                break;
            default:
                break;
        }
    };

    /**
     * Callback function to get the "name" attribute for a status element.
     */
    var configStatusElement = function configStatusElement() {
        var customName = this.getAttribute("name");

        if (customName) {
            if (this.constructor.name === IGT_XC_STATUS) {
                IGTMediaElements.xtraCreditCustomName = customName;
            } else if (this.constructor.name === IGT_CASHLESS_STATUS) {
                IGTMediaElements.cashlessCustomName = customName;
            }
        }
    };

    // used to store a list of full screen enabled elements.
    var fullScreenList = [];

    /**
     * Callback function to do the fullScreen logic.
     */
    var configFullScreen = function configFullScreen() {
        if (!this.hasAttribute("fullscreen")) {
            return;
        }

        fullScreenList.push(this);

        if (!webWorker) {
            // an observer to be used on elements designated as full screen.
            var fsObserver = new MutationObserver(function () {
                var vCount = 0;
                fullScreenList.forEach(function (ele) {
                    if (ele.style.display !== "none") {
                        vCount++;
                    }
                });

                if (vCount > 0) {
                    IGTMediaElements.util.sendMessage({ cmd: "show-full-screen" });
                } else {
                    IGTMediaElements.util.sendMessage({ cmd: "hide-full-screen" });
                }
            });

            fsObserver.observe(this, {
                attributes: true,
                attributeFilter: ["style"]
            });
        }
    };

    /**
     * Emits events using bonusId or levelname
     * @param data {Object} Original level update event
     */
    IGTMediaElements.emitLevelUpdate = function (data) {
        //emit event using bonusId
        var bonusIdEvent = new CustomEvent("levelUpdate-" + data.bonusId, {
            detail: data,
            bubbles: true,
            cancelable: false
        });
        window.dispatchEvent(bonusIdEvent);

        //emit event using levelName
        var levelNameEvent = new CustomEvent("levelUpdate-" + data.levelName, {
            detail: data,
            bubbles: true,
            cancelable: false
        });
        window.dispatchEvent(levelNameEvent);
    };

    /**
     * Publishes the validatePIN message for the pinService to validate
     * @param Pin {String} optional - The Pin string used to validate against, if no Pin is passed a
     * default Pin pad will be used to gather the users Pin.
     * @param canceled {Boolean} optional - Indicates if Pin entry was cancelled by player
     * @param forcePin {Boolean} optional - Indicates if Pin validation has to be forced in M5 (no check for CWS pin settings)
     * @returns {Promise} The validate pin status message
     */
    IGTMediaElements.validatePin = function (Pin, canceled, forcePin) {
        var cmdObject = void 0;
        Pin = Pin || "";
        canceled = canceled || false;
        forcePin = forcePin || false;

        if (typeof Pin === 'string' && Pin.length > 0 && canceled === false) {
            cmdObject = {
                "cmd": "pinEntryResp",
                "ver": "1.0",
                "PIN": Pin,
                "cancelled": false,
                "forcePin": forcePin
            };
        } else if (canceled === true) {
            cmdObject = {
                "cmd": "pinEntryResp",
                "ver": "1.0",
                "PIN": Pin,
                "cancelled": true,
                "forcePin": forcePin
            };
        } else {
            cmdObject = {
                cmd: "validatePIN",
                ver: "1.0",
                "forcePin": forcePin
            };
        }

        IGTMediaElements.util.sendMessage(cmdObject);

        return new Promise(function (resolve, reject) {
            IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PIN_VERIFIED_TOPIC, function (data) {
                resolve(data.message);
            });

            IGTMediaElements.pubSub.subscribe(IGTMediaElements.IGT_PIN_NOT_VERIFIED_TOPIC, function (data) {
                reject(data.message);
            });
        });
    };

    /**
     * Check if XtraCredit is already activated.
     */
    var isXtraCreditActive = function isXtraCreditActive() {
        isXtraCreditConstructed = true;
        IGTMediaElements.util.sendMessage({ "cmd": "isXtraCreditActive", "ver": "1.0" });
    };

    if (!webWorker && !(document.currentScript && document.currentScript.getAttribute('optimized') == '')) {
        /**
         * Creates a MediaElement based on a given name and attribute
         * @param element {Object} A media element configuration object
         */
        var createMediaElement = function createMediaElement(element) {
            var elementProto = Object.create(HTMLElement.prototype);
            /**
             * Callback function that is executed when a new custom HTML element is created
             */
            elementProto.createdCallback = function () {
                //call config
                for (var i = 0; i < element.createdCallbacks.length; i++) {
                    element.createdCallbacks[i].call(this);
                }

                //call init
                if (typeof element.init !== "undefined") {
                    element.init();
                }
            };
            document.registerElement(element.name, { prototype: elementProto });
        };

        //create elements
        createMediaElement({
            name: IGT_TOKEN_UPDATE,
            createdCallbacks: [configElement, configMediaElement]
        });
        createMediaElement({
            name: IGT_SCREEN_TRIGGER,
            createdCallbacks: [configElement, configMediaElement, configFullScreen]
        });
        createMediaElement({
            name: IGT_PATRON_RANKING,
            createdCallbacks: [configElement, configMediaElement]
        });
        createMediaElement({
            name: IGT_MEDIA,
            createdCallbacks: [configElement, configMediaElement]
        });
        createMediaElement({
            name: IGT_PIN_VERIFY,
            createdCallbacks: [configElement, configFeatureElement],
            init: IGTMediaElements.validatePin
        });
        createMediaElement({
            name: IGT_XC_ACTIVATE,
            createdCallbacks: [configElement, configFeatureElement],
            init: isXtraCreditActive
        });
        createMediaElement({
            name: IGT_XC_ACTIVATED,
            createdCallbacks: [configElement, configFeatureElement]
        });
        createMediaElement({
            name: IGT_XC_STATUS,
            createdCallbacks: [configElement, configFeatureElement, configStatusElement]
        });
        createMediaElement({
            name: IGT_PP_SHOW,
            createdCallbacks: [configElement, configFeatureElement],
            init: enablePointPlay
        });
        createMediaElement({
            name: IGT_PP_CONVERT,
            createdCallbacks: [configElement, configFeatureElement]
        });
        createMediaElement({
            name: IGT_PP_STATUS,
            createdCallbacks: [configElement, configFeatureElement]
        });
        createMediaElement({
            name: IGT_PP_POINTS,
            createdCallbacks: [configElement, configFeatureElement]
        });
        createMediaElement({
            name: IGT_LEVEL_UPDATE,
            createdCallbacks: [configElement, configLevelUpdate]
        });
        createMediaElement({
            name: IGT_CASHLESS_TRANSFER,
            createdCallbacks: [configElement, configFeatureElement]
        });
        createMediaElement({
            name: IGT_CASHLESS_STATUS,
            createdCallbacks: [configElement, configFeatureElement, configStatusElement]
        });

        createMediaElement({
            name: IGT_GAMEPLAY_IDLE,
            createdCallbacks: [configFeatureElement, configGameplayIdle]
        });
        createMediaElement({
            name: IGT_GAMEPLAY_ACTIVE,
            createdCallbacks: [configFeatureElement, configGameplayActive]
        });
    }

    //Window Events
    /**
     * Logs unhandled errors.
     */
    var errorHandler = function errorHandler(msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        var substring = "script error";

        if (string.indexOf(substring) > -1) {
            IGTMediaElements.util.log.error('Unhandled Script Error: See Browser Console for Detail.');
        } else {
            IGTMediaElements.urlparams.getUrlParams().then(function (data) {
                var machineNumber = data.machineNumber;
                var location = data.location;
                var message = ['machineNumber: ' + machineNumber, 'location: ' + location, 'Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(' - ');

                IGTMediaElements.util.log.error(message);
            });
        }

        return false;
    };

    /**
     * Gathers the status messages from shell-core-logic, and replaces names with custom variables
     * @returns {void}
     */
    var PopulateStatusMessages = function PopulateStatusMessages() {
        IGTMediaElements.statusMessageCache.getStatusMessages().then(function (data) {
            IGTMediaElements.statuses = data;
            IGTMediaElements.SetCustomNamesRecursively(IGTMediaElements.statuses['xtraCredit'], IGTMediaElements.xtraCreditDefaultName, IGTMediaElements.xtraCreditCustomName);
            IGTMediaElements.SetCustomNamesRecursively(IGTMediaElements.statuses['cashless'], IGTMediaElements.cashlessDefaultName, IGTMediaElements.cashlessCustomName);
        });
    };

    /**
     * traverses the pointPlay sub object of IGTMediaElements.statuses and replaces default names with custom name
     * @returns {void}
     */
    IGTMediaElements.SetCustomNamesRecursively = function (sourceObjset, originalName, customName) {
        for (var prop in sourceObjset) {
            if (sourceObjset.hasOwnProperty(prop)) {
                if (typeof sourceObjset[prop] === 'string') {
                    sourceObjset[prop] = sourceObjset[prop].replace(originalName, customName);
                } else {
                    IGTMediaElements.SetCustomNamesRecursively(sourceObjset[prop], originalName, customName);
                }
            }
        }
    };

    IGTMediaElements.navigateToSession = function () {
        return new Promise(function (resolve) {
            IGTMediaElements.util.sendMessage({
                cmd: 'navigateToSession',
                ver: '1.0'
            }, resolve);
        });
    };

    //prototype overrides
    /**
     * Extends String prototype for normalizing Id's
     * @returns {string}
     */
    if (!String.prototype.normalizeId) {
        String.prototype.normalizeId = function () {
            return this.charAt(0) + this.charAt(1).toLowerCase() + this.slice(2).toUpperCase();
        };
    }

    /**
     * Receive postMessages from Shell and assign global IGTMediaElements
     */
    if (!webWorker) {
        window.addEventListener("message", receiveWindowEvent);
        window.addEventListener("load", PopulateStatusMessages);
        window.onerror = errorHandler;
        window.IGTMediaElements = IGTMediaElements;
    } else {
        self.addEventListener("message", receiveWindowEvent);
        self.addEventListener("load", PopulateStatusMessages);
        self.onerror = errorHandler;
        self.IGTMediaElements = IGTMediaElements;
    }

    return IGTMediaElements;
}(IGTMediaElements || {});
//# sourceMappingURL=igt-media-elements.js.map

"use strict";

/**
 * IGTMediaElements util
 * @constructor
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

IGTMediaElements.util = function () {
    var util = {};
    var logger = {};
    var callbacks = new Map();
    var transactionId = void 0;

    /**
     * Creates a normalized hex string.
     * @param id The id can be  string of number.
     * @returns string
     */
    util.normalizeId = function (id) {
        if (typeof id === 'string') {
            return util.createIdString(parseInt(id, 16));
        } else {
            return util.createIdString(id);
        }
    };

    /**
     * Creates a normalized hex string from a number.
     * @param idint The id can of type int or number.
     * @returns string
     */
    util.createIdString = function (idint) {
        var value = idint.toString(16);
        var padded = value;
        if (value.length === 1) {
            padded = '0' + value;
        }
        return '0x' + padded.toUpperCase();
    };

    util.sendMessage = function () {
        var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        //Generate a unique transaction id.
        transactionId = crypto.getRandomValues(new Uint32Array(4)).join('-');
        //logger.debug(`Sending transaction based message: ${transactionId} for cmd: ${msg.cmd}`);
        msg.transactionId = transactionId;
        callbacks.set(transactionId, callback);

        if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) !== 'object') {
            //logger.warn(`Unable to send message because it is not an object`);
            return;
        }

        if (!webWorker) {
            window.top.postMessage(msg, "*");
        } else {
            self.postMessage(msg);
        }

        return transactionId;
    };

    util.clear = function () {
        transactionId = 0;
        callbacks = new Map();
    };

    //Get the logLevel from the urlMap
    util.sendMessage({
        cmd: 'getLogLevel',
        ver: '1.0'
    });

    util.registerListener = function (message, callback) {
        if (!webWorker) {
            window.addEventListener(message, callback, false);
        } else {
            self.addEventListener(message, callback, false);
        }
    };

    util.registerListener("message", function (_ref) {
        var _ref$data = _ref.data,
            data = _ref$data === undefined ? {} : _ref$data;

        if (typeof data.transactionId === 'undefined') {
            return;
        }

        var transId = data.transactionId;
        if (callbacks.has(transId)) {
            delete data.transactionId;
            callbacks.get(transId)(data);
            callbacks.delete(transId);
        }
    });

    /**
     * Log Levels (DEBUG < INFO < WARN < ERROR)
     * @type {{debug: string, info: string, warn: string, error: string}}
     */
    logger.level = {
        //set to match shell-core-logic enumerations
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4
    };

    /**
     * Default log level
     * @type {string}
     */
    logger.logLevel = logger.level.INFO;

    logger.name = "igt-media-elements library: ";

    /**
     * Log to Logger Service
     * @param message The logged message.
     * @param logLevel The logLevel.
     */
    var log = function log(message, logLevel) {
        if (logLevel < logger.logLevel) {
            return;
        }

        var setLogCommand = function setLogCommand(logLevel) {
            if (logLevel === logger.level.DEBUG) {
                return "log.debug";
            }

            if (logLevel === logger.level.INFO) {
                return "log.info";
            }

            if (logLevel === logger.level.WARN) {
                return "log.warn";
            }

            if (logLevel === logger.level.ERROR) {
                return "log.error";
            }
        };

        util.sendMessage({
            cmd: setLogCommand(logLevel),
            value: {
                message: message
            }
        });
    };

    /**
     * Log debug level information.
     */
    logger.debug = function (debugMsg) {
        log(logger.name + debugMsg, logger.level.DEBUG);
    };

    /**
     * Log info level information.
     */
    logger.info = function (infoMsg) {
        log(logger.name + infoMsg, logger.level.INFO);
    };

    /**
     * Log warning level information.
     */
    logger.warn = function (warnMsg) {
        log(logger.name + warnMsg, logger.level.WARN);
    };

    /**
     * Log error level information.
     */
    logger.error = function (errorMsg) {
        log(logger.name + errorMsg, logger.level.ERROR);
    };

    util.log = logger;

    return util;
}();
//# sourceMappingURL=util.js.map

"use strict";

/**
 * IGTMediaElements pub sub
 * @constructor
 */

IGTMediaElements.pubSub = function () {
    var topics = new Map();
    var pubSub = {};
    var lastToken = -1;

    pubSub.subscribe = function (topic, listener) {
        // create topic if it does not exists
        if (!topics.has(topic)) {
            topics.set(topic, new Map());
        }

        // set the listener by token
        var token = ++lastToken;
        topics.get(topic).set(token, listener);

        // provide remove logic
        return {
            remove: function remove() {
                topics.get(topic).delete(token);
                if (topics.get(topic).size === 0) {
                    topics.delete(topic);
                }
            }
        };
    };

    pubSub.publish = function (topic, info) {
        // do nothing if the topic doesn't exist
        if (!topics.has(topic)) {
            return;
        }

        // call each listener with the info
        topics.get(topic).forEach(function (listener) {
            if (listener !== undefined && typeof listener === "function") {
                listener(info);
            } else {
                IGTMediaElements.util.log.error("Listener is not a function: " + listener);
            }
        });
    };

    return pubSub;
}();
//# sourceMappingURL=pub-sub.js.map

//IGT Public API
"use strict";

/**
 * IGTMediaElements
 * @constructor
 */

var IGTMediaElements = function (api, pubSub, util) {
    var SERVER_ADDRESSES = "serverAddresses";
    var GET_SERVER_ADDRESSES = "getServerAddresses";
    var HOST_EVENT_BUTTON_PRESS = "hostEventButtonPress";
    var IGT_UNKNOWN_EVENT = "igt-unknown-event";
    var FULL_SCREEN_STATE = "fullscreenState";
    var GET_FULL_SCREEN_STATE = 'getFullscreenState';
    var VALIDATE_PIN_ENTRY_SCREEN = 'showPINEntryScreen';
    var HIDE_VALIDATE_PIN_ENTRY_SCREEN = 'hidePINEntryScreen';
    var GET_PIN_SESSION_TOKEN = 'getPinSessionToken';
    var CREATE_PIN_SESSION = 'createPinSession';
    var CREATE_PIN_SESSION_RESP = 'createPinSessionResp';
    var WINDOW_STATE = 'windowState';

    var subscriptions = new Map();

    subscriptions.set(VALIDATE_PIN_ENTRY_SCREEN, []);
    subscriptions.set(HIDE_VALIDATE_PIN_ENTRY_SCREEN, []);
    subscriptions.set(WINDOW_STATE, []);

    /**
     * Listener for pin events
     */
    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;
        var cmdList = [VALIDATE_PIN_ENTRY_SCREEN, HIDE_VALIDATE_PIN_ENTRY_SCREEN, CREATE_PIN_SESSION_RESP, WINDOW_STATE];
        if (cmdList.indexOf(cmd) !== -1) {
            pubSub.publish(cmd, data);
        }
    });

    /**
     * Helper function to listen to fullScreenState msg.
     */
    var subscribeFullScreenState = function subscribeFullScreenState() {
        return new Promise(function (resolve) {
            var handler = function handler(e) {
                var data = e.data;
                var cmd = data.cmd;
                if (cmd == FULL_SCREEN_STATE) {
                    if ("fullscreenState" in data) {
                        resolve(data.fullscreenState);
                    } else {
                        resolve(data);
                    }
                }
            };
            util.registerListener("message", handler);
        });
    };

    /**
     * Player Point Play Balance
     */
    api.playerPointBalance = IGTMediaElements.playerPointBalance;

    /**
     * Player Point Play Balance in Cents
     */
    api.pointValue = IGTMediaElements.pointValue;

    /**
     * Player Point Play Credits in units of EgmDenom
     */
    //api.pointValue = IGTMediaElements.pointValue;

    /**
     * EgmDenom (set when requested pointplay balances)
     */
    api.egmDenom = IGTMediaElements.egmDenom;

    /**
     * Publishes button press event
     */
    api.buttonPress = function (value) {
        util.sendMessage({
            cmd: "buttonPress",
            value: value
        });
    };

    /**
     * Publishes menu button press event
     */
    api.menuButtonPress = function () {
        api.buttonPress("KEYPRESS_E");
    };

    /**
     * Get Full Screen State event
     * @returns Promise fullscreenState
     */
    api.getFullscreenState = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_FULL_SCREEN_STATE,
                ver: "1.0"
            }, function (data) {
                return resolve(data.fullscreenState);
            });
        });
    };

    /**
     * Toggle FullScreen event
     * @param showBanner {boolean} show banner on fullscreen (defaulted to false)
     */
    api.toggleFullScreen = function () {
        var showBanner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        util.sendMessage({ cmd: "toggle-full-screen", showBanner: showBanner });

        return subscribeFullScreenState();
    };

    /**
     * Show FullScreen event
     * @param showBanner {boolean} show banner on fullscreen (defaulted to false)
     */
    api.showFullScreen = function () {
        var showBanner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        util.sendMessage({ cmd: "show-full-screen", showBanner: showBanner });

        return subscribeFullScreenState();
    };

    /**
     * Hide FullScreen event
     */
    api.hideFullScreen = function () {
        util.sendMessage({ cmd: "hide-full-screen" });

        return subscribeFullScreenState();
    };

    /**
    * Ad Player Loaded
    * @param adPlayerElement {html element} actual ad player iframe
     * @returns {Promise} Flag noting that the page loaded without errors. (True = no errors)
    */
    api.adPlayerLoaded = function (adPlayerElement) {
        return new Promise(function (resolve) {
            var titleDoc = adPlayerElement.contentWindow.document.title;

            //check if we got an error title rendered
            if (titleDoc.length >= 3) {
                //if we get an error code, hide ad-player
                var StringArray = titleDoc.split(" ");
                var titleHasErrorCode = StringArray.length > 0 && StringArray[0].length === 3 && !isNaN(StringArray[0]);
                var titleIsErrorString = titleDoc.trim() === "Error";

                resolve(!titleHasErrorCode && !titleIsErrorString);
            } else {
                resolve(true);
            }
        });
    };

    /**
     * Activate all available xtra credit
     * @param validatePin {Boolean} require pin validation
     */
    api.activateXtraCredit = function (validatePin) {
        validatePin = validatePin || false;
        IGTMediaElements.convertPointsToCredits = false;
        util.sendMessage({ "cmd": "activateXtraCredit", "ver": "1.0", "validatePin": validatePin });
    };

    /**
     * Activate Xtra Credit With Specific Amount
     * @param validatePin {Boolean} require pin validation
     * @param amount {Number} the xtra credit amount to be activated
     */
    api.activateXtraCreditWithAmount = function () {
        var validatePin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        IGTMediaElements.convertPointsToCredits = false;
        util.sendMessage({ "cmd": "activateXtraCreditWithAmount", "ver": "1.0", "validatePin": validatePin, "amount": amount });
    };

    /**
     * Cancel Xtra Credit
     */
    api.cancelXtraCredit = function () {
        util.sendMessage({ "cmd": "cancelXtraCredit", "ver": "1.0" });
    };

    /**
     * Show Point Play
     * @param validatePin {Boolean} require pin validation
     * @param convertPointsToCredits {Boolean} convert points to credits
     */
    api.showPointPlay = function (validatePin, convertPointsToCredits) {
        validatePin = validatePin || false;
        IGTMediaElements.convertPointsToCredits = convertPointsToCredits || false;
        IGTMediaElements.pointPlay.getInitialBalances(validatePin, IGTMediaElements.convertPointsToCredits).then(function (data) {
            if (data.status === 0) {
                IGTMediaElements.playerPointBalance = data.playerPointBalance;
                IGTMediaElements.pointValue = data.pointValue;
                IGTMediaElements.pointCredits = data.pointCredits;
                IGTMediaElements.egmDenom = data.egmDenom;

                pubSub.publish(IGTMediaElements.IGT_PP_SHOWN_TOPIC, data.egmDenom);
                pubSub.publish(IGTMediaElements.IGT_PP_POINTS_TOPIC, data.playerPointBalance);
            } else {
                pubSub.publish(IGTMediaElements.IGT_PP_NOT_SHOWN_TOPIC, {
                    status: data.status,
                    message: IGTMediaElements.statuses.pointPlay.init[data.status]
                });
            }
        });
    };

    /**
     * Select Point Play Amount
     * @param points {Number} points to convert
     */
    api.selectPointPlayAmount = function (points) {
        IGTMediaElements.pointsToCredits = points;
    };

    /**
     * Convert Point Play
     * @param convertToCredits {Boolean} convert points to credits
     */
    api.convertPoints = function (convertToCredits) {
        IGTMediaElements.convertPointsToCredits = convertToCredits || false;
        IGTMediaElements.pointPlay.convert(IGTMediaElements.pointsToCredits, IGTMediaElements.convertPointsToCredits).then(function (data) {
            pubSub.publish('igt-pp-convert-response', data);
            if (data.status === 0) {
                pubSub.publish('igt-pp-converted_topic', {
                    status: data.status + Object.keys(IGTMediaElements.statuses.pointPlay.init).length, //mapped to a single enum list for a single html status element
                    message: IGTMediaElements.statuses.pointPlay.convert[data.status]
                });
            } else {
                IGTMediaElements.pubSub.publish('igt-pp-not-converted_topic', {
                    status: data.status + Object.keys(IGTMediaElements.statuses.pointPlay.init).length, //mapped to a single enum list for a single html status element
                    message: IGTMediaElements.statuses.pointPlay.convert[data.status]
                });
            }
        });
    };

    /**
     * Cancel Point Play Conversion
     */
    api.cancelPointPlayConversion = function () {
        IGTMediaElements.convertPointsToCredits = false;
        //Just broadcast the topic to cancel point play.
        pubSub.publish(IGTMediaElements.IGT_PP_CANCEL_CONVERT_TOPIC, 0);
    };

    /**
     * Subscribe Level Update by bonusId
     * @param bonusId {Number} bonus level identifier
     * @param callback {Object} The callback function to be called
     */
    api.subscribeLevelUpdatesByBonusId = function (bonusId, callback) {
        pubSub.subscribe("igt-level-update" + "-" + bonusId, IGTMediaElements.emitLevelUpdate.bind(this));

        if (callback) {
            IGTMediaElements.levelUpdateSubscribers.set(bonusId, callback);
        }
    };

    /**
     * Subscribe Level Update by levelName
     * @param levelName {String} bonus level identifier
     * @param callback {Object} The callback function to be called
     */
    api.subscribeLevelUpdatesByLevelName = function (levelName, callback) {
        pubSub.subscribe("igt-level-update" + "-" + levelName, IGTMediaElements.emitLevelUpdate.bind(this));

        if (callback) {
            IGTMediaElements.levelUpdateSubscribers.set(levelName, callback);
        }
    };

    /**
     * Subscribe to hide pin screen events.
     * @param callback
     */
    api.subscribeHidePINEntryScreen = function (callback) {
        subscriptions.get(HIDE_VALIDATE_PIN_ENTRY_SCREEN).push(pubSub.subscribe(HIDE_VALIDATE_PIN_ENTRY_SCREEN, callback));
    };

    /**
     * Subscribe to show pin screen events.
     * @param callback
     */
    api.subscribeShowPINEntryScreen = function (callback) {
        subscriptions.get(VALIDATE_PIN_ENTRY_SCREEN).push(pubSub.subscribe(VALIDATE_PIN_ENTRY_SCREEN, callback));
    };

    /**
     * unsubscribe from hide pin screen events.
     */
    api.unsubscribeHidePINEntryScreen = function () {
        var arrayObj = subscriptions.get(HIDE_VALIDATE_PIN_ENTRY_SCREEN);

        arrayObj.forEach(function (obj) {
            obj.remove();
        });

        subscriptions.set(HIDE_VALIDATE_PIN_ENTRY_SCREEN, []);
    };

    /**
     * unsubscribe from show pin screen events.
     */
    api.unsubscribeShowPINEntryScreen = function () {
        var arrayObj = subscriptions.get(VALIDATE_PIN_ENTRY_SCREEN);

        arrayObj.forEach(function (obj) {
            obj.remove();
        });

        subscriptions.set(VALIDATE_PIN_ENTRY_SCREEN, []);
    };

    /**
     * Subscribe for updated token values
     * @param token {String} The Token to Subscribe to
     * @param callback {Object} The callback function to be called
     */
    api.subscribeToken = function (token, callback) {
        IGTMediaElements.tokenSubscribers.set(util.normalizeId(token), callback);
    };

    /**
     * Subscribe for updated screenTrigger values
     * @param screenTrigger {String} The Screen Trigger to Subscribe to
     * @param callback {Object} The callback function to be called
     */
    api.subscribeScreenTrigger = function (screenTrigger, callback) {
        IGTMediaElements.screenTriggerSubscribers.set(util.normalizeId(screenTrigger), callback);
    };

    api.subscribeWindowState = function (callback) {
        subscriptions.get(WINDOW_STATE).push(pubSub.subscribe(WINDOW_STATE, callback));
    };

    /**
     * Subscribe for all updated values for all screenTriggers.
     * @param callback {Object} The callback function to be called
     */
    api.subscribeAllScreenTriggers = function (callback) {
        IGTMediaElements.allScreenTriggersSubscribersCallback = callback;
    };

    /**
     * Unsubscribe for updated token values
     * @param token {String} The Token to unsubscribe from
     */
    api.unsubscribeToken = function (token) {
        IGTMediaElements.tokenSubscribers.delete(util.normalizeId(token));
    };

    /**
     * Unsubscribe for updated screenTrigger values.
     * @param screenTrigger {String} The Screen Trigger to unsubscribe from
     */
    api.unsubscribeScreenTrigger = function (screenTrigger) {
        IGTMediaElements.screenTriggerSubscribers.delete(util.normalizeId(screenTrigger));
    };

    /**
     * Unsubscribe for updated screenTrigger values for all screenTriggers.
     */
    api.unsubscribeAllScreenTriggers = function () {
        IGTMediaElements.allScreenTriggersSubscribersCallback = {};
    };

    /**
     * Unsubscribe for updated level update values
     * @param levelName {String} The levelName to unsubscribe from
     */
    api.unsubscribeLevelUpdateByName = function (levelName) {
        IGTMediaElements.levelUpdateSubscribers.delete(levelName);
    };

    /**
     * Unsubscribe for updated level update values
     * @param bonusId {String} The levelName to unsubscribe from
     */
    api.unsubscribeLevelUpdateById = function (bonusId) {
        IGTMediaElements.levelUpdateSubscribers.delete(bonusId);
    };

    api.unsubscribeWindowState = function (callback) {
        subscriptions.get(WINDOW_STATE).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(WINDOW_STATE, []);
    };
    /**
     * Requests values for the supplied tokens
     *
     * @param ids {Array} The tokens for which to retrieve values
     **/
    api.getTokens = function (ids) {
        for (var i = 0; i < ids.length; i++) {
            ids[i] = util.normalizeId(ids[i]);
        }
        util.sendMessage({
            "cmd": "getTokens",
            "ver": "1.0",
            "getTokens": ids
        });
    };

    /**
     * Gets the last known value for the supplied token
     *
     * @param id {String} The token for which to get the latest value
     * @returns {Object} The last known value of the token
     **/
    api.getCurrentTokenValue = function (id) {
        return new Promise(function (resolve) {
            util.sendMessage({
                "cmd": "getCurrentTokenValue",
                "ver": "1.0",
                "getCurrentTokenValue": util.normalizeId(id)
            }, resolve);
        });
    };

    /**
     * Gets the last known value for the level update
     *
     * @returns {Object} The last known value of the level update
     **/
    api.getLevelUpdate = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                "cmd": "getLevelUpdate",
                "ver": "1.0"
            }, resolve);
        });
    };

    /**
     * Gets the last known value for the patron data
     *
     * @returns {Object} The last known value of the patron data
     **/
    api.getPatronData = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                "cmd": "getPatronData",
                "ver": "1.0"
            }, resolve);
        });
    };

    /**
     * Gets the last known value for the patron data extended
     *
     * @returns {Object} The last known value of the patron data extended
     **/
    api.getPatronDataExt = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                "cmd": "getPatronDataExt",
                "ver": "1.0"
            }, resolve);
        });
    };

    /**
     * Publishes the createPinSession message for the pinService to validate and returns a status and pin session token.
     * @param Pin {String} optional - The Pin string used to validate against, if no Pin is passed a
     * default Pin pad will be used to gather the users pin.
     * @returns {Promise} The Validate pin result message and pin session token
     */
    api.createPinSession = function () {
        var Pin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";


        var cmdobj = Pin === "" ? {
            cmd: CREATE_PIN_SESSION,
            ver: "1.0"
        } : {
            cmd: CREATE_PIN_SESSION,
            ver: "1.0",
            "PIN": Pin
        };

        util.sendMessage(cmdobj);

        return new Promise(function (resolve) {

            var rm = null;
            var cb = function cb(data) {
                rm();
                resolve({
                    "status": IGTMediaElements.statuses.pin.validate[data.status],
                    "token": data.token
                });
            };
            rm = pubSub.subscribe(CREATE_PIN_SESSION_RESP, cb).remove;
        });
    };

    /**
     * Request a pin session token
     * @returns {Promise} Pin session token
     */
    api.getPinSessionToken = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_PIN_SESSION_TOKEN,
                ver: "1.0"
            }, function (data) {
                return resolve(data.token);
            });
        });
    };

    /**
     * Notify pin entry session complete.
     */
    api.pinEntryComplete = function () {
        util.sendMessage({
            "cmd": "pinEntryComplete",
            "ver": "1.0"
        });
    };

    /**
     * Show Window
     *
     * @returns {Promise} The window state (true=window is visible, false=window is hidden)
     */
    api.showWindow = function () {
        util.sendMessage({ "cmd": "showWindow", "ver": "1.0", "value": true });

        return new Promise(function (resolve) {
            pubSub.subscribe(IGTMediaElements.WINDOW_STATE_TOPIC, function (data) {
                resolve(data);
            });
        });
    };

    /**
     * Hide Window
     *
     * @returns {Promise} The window state (true=window is visible, false=window is hidden)
     */
    api.hideWindow = function () {
        util.sendMessage({ "cmd": "showWindow", "ver": "1.0", "value": false });

        return new Promise(function (resolve) {
            pubSub.subscribe(IGTMediaElements.WINDOW_STATE_TOPIC, function (data) {
                resolve(data);
            });
        });
    };

    /**
     * function to publish host event button press
     */
    api.hostEventButtonPress = function (hostEventId, subEventId, onlineOnly, bonusId) {
        util.sendMessage({
            cmd: HOST_EVENT_BUTTON_PRESS,
            value: {
                hostEventId: hostEventId,
                subEventId: subEventId,
                onlineOnly: onlineOnly,
                bonusId: bonusId
            }
        });
    };

    /**
     * function to get server addresses by domain name
     */
    api.getServerAddresses = function (addresses) {
        return new Promise(function (resolve) {
            IGTMediaElements.util.log.debug('Get Server Address with Patch for : ' + JSON.stringify(addresses));
            if (Object.prototype.toString.call(addresses).slice(8, -1) != "Array") {
                addresses = [addresses];
            }
            var len = addresses.length;
            var subscription = IGTMediaElements.pubSub.subscribe("igt-unknown-event", function (data) {
                if (data.cmd === "serverAddresses") {
                    var retobj = {};
                    addresses.forEach(function (value) {
                        var matchedServers = data.serverAddresses.filter(function (item) {
                            return item[value] != undefined;
                        });
                        if (matchedServers.length > 0 && retobj[value] == undefined) {
                            retobj[value] = matchedServers[0][value];
                            len--;
                        }
                    });
                }
                if (len <= 0) {
                    resolve(retobj);
                    subscription.remove();
                }
            });
            util.sendMessage({
                cmd: GET_SERVER_ADDRESSES,
                value: addresses
            });
        });
    };

    /*
     * function to turn on or off the autohide of service window during game play.
     * @param enabled boolean flag to turn on/off auto hide
     */
    api.disableAutoHide = function (enabled) {
        return new Promise(function (resolve) {
            util.sendMessage({
                "cmd": "disableAutoHide",
                "ver": '1.0',
                "value": enabled
            }, resolve);
        });
    };

    /**
     * function to get bonus level
     * returns {Promise} bonus level
     */
    api.getBonusLevel = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'getBonusLevel',
                ver: '1.0'
            }, function (data) {
                return resolve(data.level);
            });
        });
    };

    /**
     * function to set level of logging
     */
    api.setLogLevel = function (logLevel) {
        util.log.level = logLevel;
    };

    /**
     * function to load content
     * returns {Promise} content loaded
     */
    api.loadContent = function (url) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_/]*)?$', 'i'); // fragment locator

        if (pattern.test(url)) {
            return new Promise(function (resolve, reject) {
                util.sendMessage({
                    cmd: 'loadContent',
                    ver: '1.0',
                    url: url
                }, function (data) {
                    if (data.success) {
                        resolve("Successfully loaded content url: " + url);
                    } else {
                        reject("Failed to load content url: " + url);
                    }
                });
            });
        } else {
            var msg = "The provided loadContent url is not a valid url: " + url;
            return Promise.reject(msg);
        }
    };

    return api;
}(IGTMediaElements || {}, IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=base-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements analytics API
 * @constructor
 */

IGTMediaElements.analytics = function () {
    var analytics = {};

    /**
     * Tracks analytics for an event
     * @param eventName {String} The provided name for the event.
     * @param eventAction {String} The provided action for the event.
     * @param analyticsData {Array} The provided custom analytics data.
     */
    analytics.trackEvent = function (eventName, eventAction) {
        for (var _len = arguments.length, analyticsData = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            analyticsData[_key - 2] = arguments[_key];
        }

        IGTMediaElements.util.sendMessage({
            cmd: "analytics.event",
            value: {
                "eventName": eventName || "not specified",
                "eventAction": eventAction || "not specified",
                "patronId": IGTMediaElements.patronId,
                "analyticsData": analyticsData || []
            }
        });
    };

    /**
     * Tracks analytics for visits to a view
     * @param viewName {String} The provided name for the view.
     * @param url {String} The provided url for the view.
     * @param analyticsData {Array} The provided custom analytics data.
     */
    analytics.trackView = function (viewName, url) {
        for (var _len2 = arguments.length, analyticsData = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            analyticsData[_key2 - 2] = arguments[_key2];
        }

        IGTMediaElements.util.sendMessage({
            cmd: "analytics.view",
            value: {
                "viewName": viewName || "not specified",
                "url": url || "not specified",
                "patronId": IGTMediaElements.patronId,
                "analyticsData": analyticsData || []
            }
        });
    };

    /**
     * Track analytics for exceptions
     * @param exceptionDescription {String} The provided description for the exception.
     * @param fatal {String} This provided flag indicates if the exception was fatal.
     * @param analyticsData {Array} The provided custom analytics data.
     */
    analytics.trackException = function (exceptionDescription, fatal) {
        for (var _len3 = arguments.length, analyticsData = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            analyticsData[_key3 - 2] = arguments[_key3];
        }

        IGTMediaElements.util.sendMessage({
            cmd: "analytics.exception",
            value: {
                "exception": exceptionDescription || "not specified",
                "fatal": typeof fatal === "undefined" ? "not specified" : fatal,
                "analyticsData": analyticsData || []
            }
        });
    };

    return analytics;
}();
//# sourceMappingURL=analytics-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements audio visual sub domain
 * @constructor
 */

IGTMediaElements.audiovisual = function (util) {
    var audiovisual = {};
    var SET_BONUS_LIGHT = 'setBonusLight';

    /**
     * Disable bonus light, returns a promise that is resolved once the bonus light is off.
     * Note: Refers to the light in the BonusButton
     */
    audiovisual.bonusLightOff = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: SET_BONUS_LIGHT,
                ver: '1.0',
                enabled: false
            }, resolve);
        });
    };

    /**
     * Enable bonus light, returns a promise that is resolved once the bonus light is on.
     * Note: Refers to the light in the BonusButton
     */
    audiovisual.bonusLightOn = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: SET_BONUS_LIGHT,
                ver: '1.0',
                enabled: true
            }, resolve);
        });
    };

    /**
     * An enumeration of tones that can be used as a parameter to the playTone function.
     */
    audiovisual.tone = {
        LONG_BONUS_BUTON_PRESS: 0,
        SHORT_BONUS_BUTON_PRESS: 1,
        MONEY_TRANS_EGM: 2,
        MONEY_TRANS_GAME: 3,
        TEST: 4,
        ZIP_DOWN: 5
    };

    /**
     * Sound audible buzzer (playTone), returns a promise that is resolved once the tone is played.
     */
    audiovisual.playTone = function (tone) {
        if (typeof tone !== 'number') {
            return Promise.reject(new Error('The tone parameter should be a number'));
        }

        if ([0, 1, 2, 3, 4, 5].indexOf(tone) === -1) {
            return Promise.reject(new Error('Cannot play unknown tone ' + tone));
        }

        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'playTone',
                ver: '1.0',
                tone: tone
            }, resolve);
        });
    };

    /**
     * An enumeration of bezel colors that can be used as a parameter to the set bezel function.
     */
    audiovisual.bezelColor = {
        RELEASE_CONTROL: 0,
        RED: 1,
        GREEN: 2,
        ORANGE: 3,
        BLUE: 4,
        VIOLET: 5,
        COLOR_6: 6,
        COLOR_7: 7
    };

    /**
     * An enumeration of bezel flas values that can be used as a parameter to the set bezel function.
     */
    audiovisual.flash = {
        STATIC: 0,
        FAST: 0x10,
        MEDIUM: 0x20,
        SLOW: 0x40
    };

    /**
     * Sound audible buzzer (playTone), returns a promise that is resolved once the tone is played.
     */
    audiovisual.setBezel = function (color) {
        var flash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (typeof color !== 'number') {
            return Promise.reject(new Error('The color parameter should be a number'));
        }

        if (typeof flash !== 'number') {
            return Promise.reject(new Error('The flash parameter should be a number'));
        }

        if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(color) === -1) {
            return Promise.reject(new Error('Cannot set bezel color ' + color));
        }

        if ([0, 0x10, 0x20, 0x40].indexOf(flash) === -1) {
            return Promise.reject(new Error('Cannot set bezel flash ' + flash));
        }

        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'setBezel',
                ver: '1.0',
                color: color,
                flash: flash
            }, function (data) {
                resolve(data.color, data.flash);
            });
        });
    };

    return audiovisual;
}(IGTMediaElements.util);
//# sourceMappingURL=audio-visual-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements autoplay sub domain
 * @constructor
 */

IGTMediaElements.autoplay = function (util) {
    var autoplay = {};
    var SET_AUTOPLAY = 'setAutoplay';

    /**
     * Enable auto play, returns a promise that is resolved once auto play is enabled.
     */
    autoplay.enable = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: SET_AUTOPLAY,
                ver: '1.0',
                enabled: true
            }, function (data) {
                resolve(data.enabled);
            });
        });
    };

    /**
     * Disable auto play, returns a promise that is resolved once auto play is disabled.
     */
    autoplay.disable = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: SET_AUTOPLAY,
                ver: '1.0',
                enabled: false
            }, function (data) {
                resolve(data.enabled);
            });
        });
    };

    /**
     * Get auto play status, returns a promise that is resolved with the current auto play status.
     * The status is true if auto play is allowed, otherwise false.
     */
    autoplay.getStatus = function () {
        var checkEGMState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (typeof checkEGMState !== 'boolean') {
            return Promise.reject(new Error('The checkEGMState parameter should be a boolean'));
        }
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'getAutoplayStatus',
                ver: '1.0',
                checkEGMState: checkEGMState
            }, function (data) {
                resolve(data.status);
            });
        });
    };

    return autoplay;
}(IGTMediaElements.util);
//# sourceMappingURL=autoplay-api.js.map

"use strict";

/**
 * IGTMediaElements bonus sub domain
 * @constructor
 */

IGTMediaElements.bonus = function (pubSub, util) {
    var bonus = {};
    var TOPIC_ISM_UPDATE = "ismUpdate";
    var TOPIC_DRAW_STATUS = "drawStatus";
    var TOPIC_BONUS_HIT = "bonusHit";
    var TOPIC_GET_ISM_UPDATE = "getIsmUpdate";
    var TOPIC_GET_DRAW_STATUS = "getDrawStatus";
    var TOPIC_GET_BONUS_HIT = "getBonusHit";

    var subscriptions = new Map();

    subscriptions.set(TOPIC_ISM_UPDATE, []);
    subscriptions.set(TOPIC_DRAW_STATUS, []);
    subscriptions.set(TOPIC_BONUS_HIT, []);

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;

        if (data.cmd === TOPIC_ISM_UPDATE || data.cmd === TOPIC_DRAW_STATUS || data.cmd === TOPIC_BONUS_HIT) {
            pubSub.publish(cmd, data[cmd]);
        }
    });

    /**
     * function to Subscribe for draw status updates.
     */
    bonus.subscribeDrawStatus = function (callback) {
        var obj = pubSub.subscribe(TOPIC_DRAW_STATUS, callback);
        subscriptions.get(TOPIC_DRAW_STATUS).push(obj);
    };

    /**
     * function to unsubscribe for draw status updates.
     */
    bonus.unsubscribeDrawStatus = function () {
        var arrayObj = subscriptions.get(TOPIC_DRAW_STATUS);

        arrayObj.forEach(function (obj) {
            obj.remove();
        });

        subscriptions.set(TOPIC_DRAW_STATUS, []);
    };

    /**
     * function to Subscribe for ism updates.
     */
    bonus.subscribeIsmUpdate = function (callback) {
        var obj = pubSub.subscribe(TOPIC_ISM_UPDATE, callback);
        subscriptions.get(TOPIC_ISM_UPDATE).push(obj);
    };

    /**
     * function to unsubscribe for ism updates.
     */
    bonus.unsubscribeIsmUpdate = function () {
        var arrayObj = subscriptions.get(TOPIC_ISM_UPDATE);

        arrayObj.forEach(function (obj) {
            obj.remove();
        });

        subscriptions.set(TOPIC_ISM_UPDATE, []);
    };

    /**
     * function to Subscribe for bonus hits.
     */
    bonus.subscribeBonusHit = function (callback) {
        var obj = pubSub.subscribe(TOPIC_BONUS_HIT, callback);
        subscriptions.get(TOPIC_BONUS_HIT).push(obj);
    };

    /**
     * function to unsubscribe for bonus hits.
     */

    bonus.unsubscribeBonusHit = function () {
        var arrayObj = subscriptions.get(TOPIC_BONUS_HIT);

        arrayObj.forEach(function (obj) {
            obj.remove();
        });

        subscriptions.set(TOPIC_BONUS_HIT, []);
    };

    /**
     * function to get the latest cached value for the ISM Update
     */

    bonus.getIsmUpdate = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_ISM_UPDATE,
                ver: '1.0'
            }, function (data) {
                resolve(data.ismUpdate);
            });
        });
    };

    /**
     * function to get the latest cached value for the Draw Status
     */

    bonus.getDrawStatus = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_DRAW_STATUS,
                ver: '1.0'
            }, function (data) {
                resolve(data.drawStatus);
            });
        });
    };

    /**
     * function to get the latest cached value for the Bonus Hit
     */

    bonus.getBonusHit = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_BONUS_HIT,
                ver: '1.0'
            }, function (data) {
                resolve(data.bonusHit);
            });
        });
    };

    /**
     * Reset fuzzy jackpot, returns a promise that is resolved once the payToCreditEnableEGM
     * be2Basic function is processed.
     */

    bonus.fuzzyJackpotReset = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'payToCreditEnableEGM',
                ver: '1.0'
            }, resolve);
        });
    };

    return bonus;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=bonus-api.js.map

"use strict";

/**
 * IGTMediaElements cashless sub domain
 * @constructor
 */

IGTMediaElements.cashless = function (pubSub, util) {
    var cashless = {};
    var TOPIC_INIT_TRANS_FROM_CARD = "initiateTransferFromCard";
    var TOPIC_INIT_TRANS_FROM_EGM = "initiateTransferFromEgm";
    var TOPIC_INIT_TRANS_RESP = "initiateTransferResp";
    var TOPIC_GET_BALANCE = "getCashlessBalance";
    var TOPIC_GET_BALANCE_RESP = "getCashlessBalanceResp";
    var TOPIC_CHECK_ENABLED = "checkCashlessEnabled";
    var TOPIC_CHECK_ENABLED_RESP = "checkCashlessEnabledResp";
    var TOPIC_IS_PIN_LOCKED = "isPINLocked";
    var TOPIC_LOCK_PIN = "lockPIN";
    var TOPIC_PATRON_CARD_UNLOCK = "patronCardUnlock";
    var TOPIC_ATTENDANT_CARD_UNLOCK = "attendantCardUnlock";

    var formatEnabledResp = function formatEnabledResp(value) {
        return {
            enabled: value.enabled,
            responseData: {
                cardType: value.responseData.cardType,
                bonusing: value.responseData.bonusing,
                haveData: value.responseData.haveData,
                haveLock: value.responseData.haveLock,
                gameEnabled: value.responseData.gameEnabled,
                coinlessAvailable: value.responseData.coinlessAvailable,
                balanceActive: value.responseData.balanceActive,
                cashlessEnabled: value.responseData.cashlessEnabled,
                abandonedStatus: value.responseData.abandonedStatus,
                haveCTSData: value.responseData.haveCTSData,
                haveCardData: value.responseData.haveCardData,
                coinlessEnabled: value.responseData.coinlessEnabled
            }
        };
    };

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;

        if (data.cmd === TOPIC_INIT_TRANS_RESP) {
            pubSub.publish(cmd, data.transferData);
        } else if (data.cmd === TOPIC_GET_BALANCE_RESP) {
            pubSub.publish(cmd, data.cashlessBalances);
        } else if (data.cmd === TOPIC_CHECK_ENABLED_RESP) {
            pubSub.publish(cmd, formatEnabledResp(data));
        }
    });

    /**
     * Request a cashless transfer from card.
     */
    cashless.initiateTransferFromCard = function (amount, validatePin) {
        util.sendMessage({
            cmd: TOPIC_INIT_TRANS_FROM_CARD,
            ver: "1.0",
            transferAmount: amount,
            validatePin: validatePin === undefined ? false : validatePin
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_INIT_TRANS_RESP, cb).remove;
        });
    };

    /**
     * Request a cashless transfer from EGM.
     */
    cashless.initiateTransferFromEgm = function (amount, cashoutRequest, ejectCard, autoPlayInUse, allowTransferOverMaxBal, validatePin) {
        util.sendMessage({
            cmd: TOPIC_INIT_TRANS_FROM_EGM,
            ver: "1.0",
            amount: amount,
            cashoutRequest: cashoutRequest,
            allowTransferOverMaxBal: allowTransferOverMaxBal === undefined ? false : allowTransferOverMaxBal,
            validatePin: validatePin === undefined ? false : validatePin,
            smartCard: {
                ejectCard: ejectCard === undefined ? false : ejectCard,
                autoPlayInUse: autoPlayInUse === undefined ? false : autoPlayInUse
            }
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_INIT_TRANS_RESP, cb).remove;
        });
    };

    /**
     * Request a cashless balance.
     */
    cashless.getCashlessBalance = function () {
        util.sendMessage({
            cmd: TOPIC_GET_BALANCE,
            ver: "1.0"
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_GET_BALANCE_RESP, cb).remove;
        });
    };

    /**
     * Request a cashless enabled check.
     */
    cashless.checkCashlessEnabled = function () {
        util.sendMessage({
            cmd: TOPIC_CHECK_ENABLED,
            ver: "1.0"
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_CHECK_ENABLED_RESP, cb).remove;
        });
    };

    /**
     * Request Pin Lock status
     * @returns {Promise} Locked boolean status
     */
    cashless.isPinLocked = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_IS_PIN_LOCKED,
                ver: "1.0"
            }, function (data) {
                return resolve(data.locked);
            });
        });
    };

    /**
     * Request lock PIN
     */
    cashless.lockPin = function () {
        util.sendMessage({
            cmd: TOPIC_LOCK_PIN,
            ver: "1.0"
        });
    };

    /**
     * Smart Card patronCardUnlock Request
     * @returns {Promise} Lock status
     */
    cashless.patronCardUnlock = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_PATRON_CARD_UNLOCK,
                ver: "1.0"
            }, function (data) {
                return resolve(data.status);
            });
        });
    };

    /**
     * Request lock Card Unlock
     * @param unlockCode (string) Attendant unlock code.
     */
    cashless.attendantCardUnlock = function (unlockCode) {
        util.sendMessage({
            cmd: TOPIC_ATTENDANT_CARD_UNLOCK,
            ver: "1.0",
            unlockCode: unlockCode
        });
    };

    return cashless;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=cashless-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements contentCache sub domain
 * @constructor
 */

IGTMediaElements.contentCache = function (util) {
    var contentCache = {};
    var GET_TOKENS = 'getTokenHistory';
    var GET_TRIGGERS = 'getTriggerHistory';
    var REQUEST_SEND_TRIGGERS = 'requestSendTriggers';
    var REQUEST_SEND_TOKENS = 'requestSendTokens';
    var GET_TRIGGERS_TOKENS = 'getAllHistory';
    var GET_STATE = 'getStateElement';
    var GET_ALL_STATE = 'getAllStateElements';
    var SET_STATE = 'setStateElement';
    var DELETE_STATE = 'deleteStateElement';
    var CLEAR_STATE = 'clearAllStateElements';

    /**
     * Get a list of tokens only. The list returned is ordered by time of occurrence, the last
     * item in the list is the most recent.
     */
    contentCache.getTokens = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_TOKENS,
                ver: "1.0"
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Get a list of triggers only. The list returned is ordered by time of occurrence, the last
     * item in the list is the most recent.
     */
    contentCache.getTriggers = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_TRIGGERS,
                ver: "1.0"
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Get a list of triggers and tokens and their corresponding values. The list returned is
     * ordered by time of occurrence, the last item in the list is the most recent.
     */
    contentCache.getTriggersTokens = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_TRIGGERS_TOKENS,
                ver: "1.0"
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Get a single state element key-value pair based off the key.
     * @param key: The key of the state element being retrieved.
     */
    contentCache.getStateElement = function (key) {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_STATE,
                ver: "1.0",
                value: key
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Get entire state cache.
     */
    contentCache.getState = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_ALL_STATE,
                ver: "1.0"
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Set a custom state element key-value pair with an optional timeout (in seconds)
     * @param key: The key of the state element being set
     * @param value: The value of the state element being set
     * @param timeout (optional): An optional timeout for this key-value pair (in seconds).
     */
    contentCache.setStateElement = function (key, value, timeout) {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: SET_STATE,
                ver: "1.0",
                key: key,
                value: value,
                timeout: timeout * 1000
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Delete a custom state element key-value pair based off the key
     * @param key: The key of the state element being deleted
     */
    contentCache.deleteStateElement = function (key) {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: DELETE_STATE,
                ver: "1.0",
                value: key
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Clear all custom state elements from the cache
     */
    contentCache.clearAllStateElements = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: CLEAR_STATE,
                ver: "1.0"
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    /**
     * Send a list of triggers and there corresponding values to content. The triggers are sent in the
     * order of occurrence.  The last trigger sent to the content would be the most recent.
     */
    contentCache.sendTriggersToContent = function () {
        util.sendMessage({
            cmd: REQUEST_SEND_TRIGGERS,
            ver: "1.0"
        });
    };

    /**
     * Send a list of tokens and there corresponding values to content. The triggers are sent in the
     * order of occurrence.  The last trigger sent to the content would be the most recent.
     */
    contentCache.sendTokensToContent = function () {
        util.sendMessage({
            cmd: REQUEST_SEND_TOKENS,
            ver: "1.0"
        });
    };

    return contentCache;
}(IGTMediaElements.util);
//# sourceMappingURL=content-cache-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements emulation sub domain
 * @constructor
 */

IGTMediaElements.emulation = function (util) {
    var emulation = {};
    /**
     * Activates the Diagnostics Menu.
     */
    emulation.activateDiagnostics = function (pin) {
        util.sendMessage({
            cmd: 'activateDiagnostics',
            ver: "1.0",
            activateDiagnostics: {
                pin: pin
            }
        });
    };

    return emulation;
}(IGTMediaElements.util);
//# sourceMappingURL=emulation-api.js.map

"use strict";

/**
 * IGTMediaElements ewallet sub domain
 * @constructor
 */

IGTMediaElements.ewallet = function (pubSub, util) {
    var ewallet = {};
    var FORCE_CARD_OUT = "forceCardOut";
    var FORCE_CARD_OUT_ACK = "forceCardOutAck";
    var GET_QR_CODE = "getQRcode";
    var QR_CODE = "qrCode";
    var IGT_UNKNOWN_EVENT = "igt-unknown-event";

    /**
     * function to Send the force card out command.
     */
    ewallet.forceCardOut = function () {
        util.sendMessage({
            cmd: FORCE_CARD_OUT
        });

        return new Promise(function (resolve) {
            var handler = function handler(data) {
                if (data.cmd === FORCE_CARD_OUT_ACK) {
                    resolve(data[FORCE_CARD_OUT_ACK]);
                }
            };
            pubSub.subscribe(IGT_UNKNOWN_EVENT, handler);
        });
    };

    /**
     * function to Send a request for QR code.
     */
    ewallet.getQRCode = function () {
        util.sendMessage({
            cmd: GET_QR_CODE
        });

        return new Promise(function (resolve) {
            var handler = function handler(data) {
                if (data.cmd === QR_CODE) {
                    resolve(data[QR_CODE]);
                }
            };
            pubSub.subscribe(IGT_UNKNOWN_EVENT, handler);
        });
    };

    return ewallet;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=ewallet-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements game sub domain
 * @constructor
 */

IGTMediaElements.game = function (pubSub, util) {
    var game = {};
    var TOPIC_GAME_START = "gameStart";
    var TOPIC_GET_GAME_START = "getGameStart";
    var TOPIC_GAME_END = "gameEnd";
    var TOPIC_GET_GAME_END = "getGameEnd";
    var TOPIC_GAME_EVENT = "gameEvent";
    var TOPIC_STATUS_UPDATE = "statusUpdate";
    var subscriptions = new Map();

    subscriptions.set(TOPIC_GAME_START, []);
    subscriptions.set(TOPIC_GAME_END, []);
    subscriptions.set(TOPIC_GAME_EVENT, new Map());
    subscriptions.set(TOPIC_STATUS_UPDATE, []);

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;
        if (data.cmd === TOPIC_GAME_START || data.cmd === TOPIC_GAME_END || data.cmd === TOPIC_STATUS_UPDATE) {
            pubSub.publish(cmd, data[cmd]);
        } else if (data.cmd === TOPIC_GAME_EVENT) {
            pubSub.publish(cmd + "_" + data.gameEvent);
        }
    });

    /**
     * function to Subscribe for game start events.
     */
    game.subscribeGameStart = function (callback) {
        util.sendMessage({
            cmd: 'gameStartSubscribe',
            ver: "1.0"
        });
        subscriptions.get(TOPIC_GAME_START).push(pubSub.subscribe(TOPIC_GAME_START, callback));
    };

    /**
     * function to unsubscribe for game start events.
     */
    game.unsubscribeGameStart = function () {
        subscriptions.get(TOPIC_GAME_START).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(TOPIC_GAME_START, []);
    };

    /**
     * function to Subscribe for game end events.
     */
    game.subscribeGameEnd = function (callback) {
        util.sendMessage({
            cmd: 'gameEndSubscribe',
            ver: "1.0"
        });
        subscriptions.get(TOPIC_GAME_END).push(pubSub.subscribe(TOPIC_GAME_END, callback));
    };

    /**
     * function to get the latest cached value for the Game Start
     */

    game.getGameStart = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_GAME_START,
                ver: '1.0'
            }, function (data) {
                resolve(data.gameStart);
            });
        });
    };

    /**
     * function to unsubscribe for game end events.
     */
    game.unsubscribeGameEnd = function () {
        subscriptions.get(TOPIC_GAME_END).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(TOPIC_GAME_END, []);
    };

    /**
     * function to get the latest cached value for the Game End
     */

    game.getGameEnd = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_GAME_END,
                ver: '1.0'
            }, function (data) {
                resolve(data.gameEnd);
            });
        });
    };

    /**
     * function to Subscribe for game event by id or list of game event ids.
     */
    game.subscribeGameEvent = function (gameEventId, callback) {
        var gameEventList = Array.isArray(gameEventId) ? gameEventId : [gameEventId];
        util.sendMessage({
            cmd: 'gameEventSubscribe',
            value: gameEventList,
            ver: "1.0"
        });
        var gameEventSubs = subscriptions.get(TOPIC_GAME_EVENT);
        gameEventList.forEach(function (id) {
            // create game event subscription if needed
            if (!gameEventSubs.has(id)) {
                gameEventSubs.set(id, []);
            }
            // add the subscription
            var gameEventIdSub = gameEventSubs.get(id);
            var topicName = TOPIC_GAME_EVENT + "_" + id;
            var subscriptionRes = pubSub.subscribe(topicName, callback);
            gameEventIdSub.push(subscriptionRes);
        });
    };

    /**
     * function to unsubscribe for game event by id or list of game event ids.
     */
    game.unsubscribeGameEvent = function (gameEventId) {
        var gameEventList = Array.isArray(gameEventId) ? gameEventId : [gameEventId];
        gameEventList.forEach(function (id) {
            subscriptions.get(TOPIC_GAME_EVENT).get(id).forEach(function (sub) {
                sub.remove();
            });
            subscriptions.get(TOPIC_GAME_EVENT).set(id, []);
        });
    };

    /**
     * function to Subscribe for status updates.
     */
    game.subscribeStatusUpdate = function (callback) {
        subscriptions.get(TOPIC_STATUS_UPDATE).push(pubSub.subscribe(TOPIC_STATUS_UPDATE, callback));
    };

    /**
     * function to unsubscribe for status updates.
     */
    game.unsubscribeStatusUpdate = function () {
        subscriptions.get(TOPIC_STATUS_UPDATE).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(TOPIC_STATUS_UPDATE, []);
    };

    return game;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=game-api.js.map

"use strict";

IGTMediaElements.names = {
    "machineNumber": "igt-token-update-0x10",
    "totalPointBal": "igt-token-update-0x11",
    "pointCountdown": "igt-token-update-0x12",
    "sessionPoints": "igt-token-update-0x13",
    "egmId": "igt-token-update-0x17",
    "pointBalAvail": "igt-token-update-0x1B",
    "xcInactiveBal": "igt-token-update-0x23",
    "xcActiveBal": "igt-token-update-0x27",
    "compBal": "igt-token-update-0x2E",
    "firstName": "igt-token-update-0x30",
    "preferredName": "igt-token-update-0x30",
    "cardId": "igt-token-update-0x31",
    "isAbandoned": "igt-token-update-0x33",
    "duplicateLoc": "igt-token-update-0x36",
    "location": "igt-token-update-0xAF",
    "xcActive": "igt-screen-trigger-0x14",
    "isAnniversary": "igt-screen-trigger-0x31",
    "isBirthday": "igt-screen-trigger-0x32",
    "playerId": "igt-token-update-0x45"
};
//# sourceMappingURL=names.js.map

"use strict";

/**
 * IGTMediaElements point pay sub domain
 * @constructor
 */

IGTMediaElements.pointPay = function (pubSub, util) {
    var pointPay = {};
    var CHECK_POINT_PAY_ENABLED_TOPIC = "checkPointPayEnabled";
    var CHECK_POINT_PAY_ENABLED_RESP_TOPIC = "checkPointPayEnabledResp";
    var CHECK_POINT_PAY_CODE_TOPIC = "checkPointPayCode";
    var CHECK_POINT_PAY_CODE_RESP_TOPIC = "checkPointPayCodeResp";
    var INITIATE_POINT_PAY_TOPIC = "initiatePointPay";
    var INITIATE_POINT_PAY_RESP_TOPIC = "initiatePointPayResp";

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;

        if (cmd === CHECK_POINT_PAY_ENABLED_RESP_TOPIC) {
            pubSub.publish(cmd, data.enabled);
        } else if (cmd === CHECK_POINT_PAY_CODE_RESP_TOPIC) {
            pubSub.publish(cmd, data.valid);
        } else if (cmd === INITIATE_POINT_PAY_RESP_TOPIC) {
            pubSub.publish(cmd, data.status);
        }
    });

    /**
     * Check if Point Pay is enabled.
     */
    pointPay.checkPointPayEnabled = function () {
        util.sendMessage({
            cmd: CHECK_POINT_PAY_ENABLED_TOPIC,
            ver: "1.0"
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(CHECK_POINT_PAY_ENABLED_RESP_TOPIC, cb).remove;
        });
    };

    /**
     * Check if supplied Point Pay code is valid.
     */
    pointPay.validatePointPayCode = function (code) {
        util.sendMessage({
            cmd: CHECK_POINT_PAY_CODE_TOPIC,
            ver: "1.0",
            code: code
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(CHECK_POINT_PAY_CODE_RESP_TOPIC, cb).remove;
        });
    };

    /**
     * Initiate a Point Pay transaction.
     */
    pointPay.initiatePointPayTransaction = function (points) {
        util.sendMessage({
            cmd: INITIATE_POINT_PAY_TOPIC,
            ver: "1.0",
            points: points
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(INITIATE_POINT_PAY_RESP_TOPIC, cb).remove;
        });
    };
    return pointPay;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=point-pay-api.js.map

/* global IGTMediaElements */
'use strict';

/**
 * IGTMediaElements point Play sub domain
 * @constructor
 */

IGTMediaElements.pointPlay = function (pubSub, util) {
    var pointPlay = {};
    var TOPIC_ENABLE_POINT_PLAY_RESP = 'enablePointPlayResp';
    var TOPIC_INIT_POINT_PLAY_RESP = 'initPointPlayResp';
    var TOPIC_CONVERT_POINT_PLAY_RESP = 'convertPointPlayResp';

    util.registerListener('message', function (e) {
        var data = e.data;
        var cmd = data.cmd;

        if ([TOPIC_ENABLE_POINT_PLAY_RESP, TOPIC_INIT_POINT_PLAY_RESP, TOPIC_CONVERT_POINT_PLAY_RESP].indexOf(data.cmd) > -1) {
            pubSub.publish(cmd, data);
        }
    });
    /**
     * Make a request to see if point play is enabled.
     */
    pointPlay.isEnabled = function () {
        util.sendMessage({ cmd: 'enablePointPlay', ver: '1.0' });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_ENABLE_POINT_PLAY_RESP, cb).remove;
        });
    };
    /**
     * Make a request to get the initial point play balances.
     */
    pointPlay.getInitialBalances = function () {
        var validatePin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var convertPointsToCredits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


        util.sendMessage({
            cmd: 'initPointPlay',
            ver: '1.0',
            validatePin: validatePin,
            convertPointsToCredits: convertPointsToCredits
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_INIT_POINT_PLAY_RESP, cb).remove;
        });
    };
    /**
     * Make a request to convert point play with points.
     */
    pointPlay.convert = function (pointsToConvert) {
        var convertPointsToCredits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


        if (typeof pointsToConvert === 'undefined') {
            return Promise.reject(new Error('pointsToConvert must be defined'));
        }

        util.sendMessage({
            cmd: 'convertPointPlay',
            ver: '1.0',
            convertPointsToCredits: convertPointsToCredits,
            pointsToConvert: pointsToConvert
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_CONVERT_POINT_PLAY_RESP, cb).remove;
        });
    };
    /**
     * Make a request to get value to points conversion (value is always cents)
     */
    pointPlay.valueToPoints = function () {
        var cents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'valueToPoints',
                ver: '1.0',
                cents: cents
            }, resolve);
        });
    };
    /**
     * Make a request to disable match play
     */
    pointPlay.disableMatchPlay = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'disableMatchPlay',
                ver: '1.0'
            }, resolve);
        });
    };

    return pointPlay;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=point-play-api.js.map

'use strict';

/**
 * IGTMediaElements SPIN sub domain
 *
 * @constructor
 */

IGTMediaElements.spin = function (pubSub, util) {
    var spin = {};
    var TOPIC_USER_TOKENS = "userTokenUpdate";
    var TOPIC_LANGUAGE_UPDATE = "languageUpdate";
    var TOPIC_SCREEN_TRIGGER = "screenTrigger";
    var TOPIC_DELIVERY_GAME = "deliveryGame";
    var subscriptions = new Map();

    subscriptions.set(TOPIC_USER_TOKENS, new Map());
    subscriptions.set(TOPIC_LANGUAGE_UPDATE, []);
    subscriptions.set(TOPIC_DELIVERY_GAME, []);

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;

        if (cmd === TOPIC_USER_TOKENS) {
            data[cmd].forEach(function (userToken) {
                var callbacks = subscriptions.get(TOPIC_USER_TOKENS).get(userToken.id);
                if (typeof callbacks !== 'undefined') {
                    callbacks.forEach(function (callback) {
                        callback(userToken);
                    });
                }
            });
        } else if (cmd === TOPIC_LANGUAGE_UPDATE) {
            pubSub.publish(cmd, data[cmd]);
        } else if (cmd === TOPIC_SCREEN_TRIGGER && typeof data.screenTrigger.messageTokens !== 'undefined' && typeof data.screenTrigger.messageTokens.deliveryGame !== 'undefined') {
            pubSub.publish(TOPIC_DELIVERY_GAME, data.screenTrigger.messageTokens.deliveryGame);
        }
    });

    /**
     * Subscribe for updated User Token values.
     *
     * @param userTokens {Array} The User Tokens to Subscribe to.
     * @param callback {Object} The callback function to be called when a User Token is received.
     */
    spin.subscribeUserTokens = function (userTokens, callback) {
        if (!Array.isArray(userTokens)) {
            return new Error("Call to spin.subscribeUserTokens failed: User Tokens must be an array.");
        }
        userTokens.forEach(function (id) {
            var subTokenList = subscriptions.get(TOPIC_USER_TOKENS);
            subTokenList.set(util.normalizeId(id), []);
            subTokenList.get(util.normalizeId(id)).push(callback);
        });
    };

    /**
     * Function to unsubscribe specific User Tokens.
     * @param userTokens {Array} The User Tokens to unsubscribe to.
     */
    spin.unsubscribeUserTokens = function (userTokens) {
        if (!Array.isArray(userTokens)) {
            return new Error("Call to spin.unsubscribeUserTokens failed: User Token Ids must be an array.");
        }
        var subscribedTokens = subscriptions.get(TOPIC_USER_TOKENS);
        userTokens.forEach(function (id) {
            if (subscribedTokens.has(util.normalizeId(id))) {
                subscribedTokens.delete(util.normalizeId(id));
            }
        });
    };

    /**
     * Function to unsubscribe from all User Tokens.
     */
    spin.unsubscribeAllUserTokens = function () {
        subscriptions.delete(TOPIC_USER_TOKENS);
        subscriptions.set(TOPIC_USER_TOKENS, new Map());
    };

    /**
     * Gets the last known value for the supplied User Tokens.
     *
     * @param ids {Array} The User Token Ids to retrieve from cache.
     * @returns {Object} The last known value of the User Tokens.
     **/
    spin.getUserTokens = function (ids) {
        return new Promise(function (resolve, reject) {
            if (!Array.isArray(ids)) {
                return reject(new Error("Call to spin.getUserTokens failed: Ids must be an array."));
            }
            for (var i = 0; i < ids.length; i++) {
                ids[i] = util.normalizeId(ids[i]);
            }
            util.sendMessage({
                "cmd": "getUserTokens",
                "ver": "1.0",
                "userTokens": ids
            }, resolve);
        });
    };

    /**
     * Subscribe for Delivery Games
     * @param callback {Object} The callback function to be called when a deliveryGame is received.
     **/
    spin.subscribeDeliveryGame = function (callback) {
        subscriptions.get(TOPIC_DELIVERY_GAME).push(pubSub.subscribe(TOPIC_DELIVERY_GAME, callback));
    };

    /**
     * Unsubscribe from Delivery Games
     **/
    spin.unsubscribeDeliveryGame = function () {
        subscriptions.get(TOPIC_DELIVERY_GAME).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(TOPIC_DELIVERY_GAME, []);
    };

    /**
     * Subscribe for Language Updates.
     *
     * @param callback {Object} The callback function to be called when a languageUpdate is received.
     */
    spin.subscribeLanguage = function (callback) {
        subscriptions.get(TOPIC_LANGUAGE_UPDATE).push(pubSub.subscribe(TOPIC_LANGUAGE_UPDATE, callback));
    };

    /**
     * Function to unsubscribe from Language Update.
     */
    spin.unsubscribeLanguage = function () {
        subscriptions.get(TOPIC_LANGUAGE_UPDATE).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(TOPIC_USER_TOKENS, []);
    };

    /**
     * Gets the last known value for the SPIN languageUpdate.
     *
     * @returns {Object} The last known value of the languageUpdate.
     **/
    spin.getLanguage = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                "cmd": "getLanguage",
                "ver": "1.0"
            }, resolve);
        });
    };

    return spin;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=spin-api.js.map

/* global IGTMediaElements */
"use strict";

/**
 * IGTMediaElements statusMessageCache sub domain
 * @constructor
 */

IGTMediaElements.statusMessageCache = function (util) {
    var statusMessageCache = {};
    var GET_STATUS_MESSAGES = 'getStatusMessages';

    /**
     * Get the cache of status message objects including any customizations already stored
     */
    statusMessageCache.getStatusMessages = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_STATUS_MESSAGES,
                ver: "1.0"
            }, function (data) {
                return resolve(data.value);
            });
        });
    };

    //getStatusMessages().then(function (data){IGTMediaElements.statuses = data});

    return statusMessageCache;
}(IGTMediaElements.util);
//# sourceMappingURL=status-message-cache-api.js.map

"use strict";

/**
 * IGTMediaElements urlparams sub domain
 * @constructor
 */

IGTMediaElements.urlparams = function (util) {
    var urlparams = {};
    var GET_URL_PARAMS = "getUrlParams";
    /**
     * function to asynchronously get the urlParams parsed by the shell
     */
    urlparams.getUrlParams = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: GET_URL_PARAMS
            }, function (data) {
                return resolve(data.data);
            });
        });
    };
    return urlparams;
}(IGTMediaElements.util);
//# sourceMappingURL=urlparams-api.js.map

"use strict";

/**
 * IGTMediaElements vpc sub domain
 * @constructor
 */

IGTMediaElements.vpc = function (pubSub, util) {
    var vpc = {};
    var TOPIC_PLAYER_DATA = "vpcPlayerData";
    var subscriptions = new Map();

    subscriptions.set(TOPIC_PLAYER_DATA, []);

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;
        if (data.cmd === TOPIC_PLAYER_DATA) {
            pubSub.publish(cmd, data[cmd]);
        }
    });

    /**
     * function to submit a vpc pin with a pin string.
     */
    vpc.validatePin = function (pinString) {
        util.sendMessage({
            cmd: "vpcPIN",
            value: pinString
        });
    };

    /**
     * function to Publish a vpc button press value.
     */
    vpc.buttonPress = function (value) {
        util.sendMessage({
            cmd: "vpcButtonPress",
            value: value || "VPC_KEYPRESS_S"
        });
    };

    /**
     * function to Get vpc player data.
     */
    vpc.getPlayerData = function () {
        util.sendMessage({
            cmd: "vpcGetPlayerData"
        });

        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_PLAYER_DATA, cb).remove;
        });
    };

    /**
     * function to subscribe a callback function to the vpc player data.
     */
    vpc.subscribePlayerData = function (callback) {
        subscriptions.get(TOPIC_PLAYER_DATA).push(pubSub.subscribe(TOPIC_PLAYER_DATA, callback));
    };

    /**
     * function to unsubscribe from the vpc player data.
     */
    vpc.unsubscribePlayerData = function () {
        subscriptions.get(TOPIC_PLAYER_DATA).forEach(function (sub) {
            sub.remove();
        });
        subscriptions.set(TOPIC_PLAYER_DATA, []);
    };

    return vpc;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=vpc-api.js.map

"use strict";

/**
 * IGTMediaElements w2gAccrual sub domain
 * @constructor
 */

IGTMediaElements.w2gAccrual = function (pubSub, util) {
    var w2gAccrual = {};

    /**
     *  initialize W2G and get data
     */
    w2gAccrual.init = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2gInit',
                ver: '1.0'
            }, resolve);
        });
    };

    /**
     * Make a request for an attendant
     */
    w2gAccrual.requestAttendant = function (handpayAmount) {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2grequestAttendant',
                ver: '1.0',
                handpayAmount: handpayAmount
            }, resolve);
        });
    };

    /**
     * Make a request to send handpay to credit meter
     */
    w2gAccrual.resetToCreditMeter = function (handPayAmount, creditHandPayAmount, witnessInitiated) {
        var pinValidated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (handPayAmount === undefined || handPayAmount <= 0 || creditHandPayAmount === undefined || creditHandPayAmount <= 0) {
            return Promise.reject(new Error('cannot call resetToCreditMeter with zero, negative, or undefined amount'));
        }
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2gresetToCreditMeter',
                ver: '1.0',
                pinValidated: pinValidated,
                handPayAmount: handPayAmount,
                creditHandPayAmount: creditHandPayAmount,
                witnessInitiated: witnessInitiated
            }, resolve);
        });
    };

    /**
     * Make a request to set attendent return
     */
    w2gAccrual.setAttendantReturn = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2gsetAttendantReturn',
                ver: '1.0'
            }, resolve);
        });
    };

    /**
     * Make a request for is witness required
     */
    w2gAccrual.isWitnessRequired = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2gisWitnessRequired',
                ver: '1.0'
            }, resolve);
        });
    };

    /**
     * Make a request to validate witness
     */
    w2gAccrual.validateWitness = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2gvalidateWitness',
                ver: '1.0'
            }, resolve);
        });
    };

    /**
     * Make a request to drop into legacy mode by unlocking override
     */
    w2gAccrual.gotoLegacy = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2ggotoLegacyRequest',
                ver: '1.0'
            }, resolve);
        });
    };

    /**
     * Make a request to cancel w2g
     */
    w2gAccrual.cancelW2G = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: 'w2gCancelRequest',
                ver: '1.0'
            }, resolve);
        });
    };

    return w2gAccrual;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=w2g-accrual.js.map

"use strict";

/**
 * IGTMediaElements Attendant sub domain
 * @constructor
 */

IGTMediaElements.attendant = function (pubSub, util) {
    var TOPIC_CHECK_ATTENDANT_CARD_INSERTED_RESP = "attendantCardInsertedResp";
    var attendant = {};

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;
        if (data.cmd === TOPIC_CHECK_ATTENDANT_CARD_INSERTED_RESP) {
            pubSub.publish(cmd, data);
        }
    });

    attendant.isAttendantCardInserted = function () {
        util.sendMessage({ cmd: 'attendantCardInserted', ver: '1.0' });
        return new Promise(function (resolve) {
            var rm = null;
            var cb = function cb(value) {
                rm();
                resolve(value);
            };
            rm = pubSub.subscribe(TOPIC_CHECK_ATTENDANT_CARD_INSERTED_RESP, cb).remove;
        });
    };
    return attendant;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=attendant-api.js.map

"use strict";

/**
 * IGTMediaElements cardless sub domain
 * @constructor
 */

IGTMediaElements.cardless = function (pubSub, util) {
    var cardless = {};
    var TOPIC_CARDLESS_STATUS_UPDATE = "cardlessStatusUpdate";
    var TOPIC_GET_CARDLESS_STATUS = "getCardlessStatus";
    var TOPIC_GET_CARDLESS_STATUS_HISTORY = "getCardlessStatusHistory";

    var subscriptions = new Map();
    subscriptions.set(TOPIC_CARDLESS_STATUS_UPDATE, []);

    util.registerListener("message", function (e) {
        var data = e.data;
        var cmd = data.cmd;

        if (data.cmd === TOPIC_CARDLESS_STATUS_UPDATE) {
            pubSub.publish(cmd, data[cmd]);
        }
    });

    /**
     * function to Subscribe for cardles status updates.
     */
    cardless.subscribeCardlessStatus = function (callback) {
        var obj = pubSub.subscribe(TOPIC_CARDLESS_STATUS_UPDATE, callback);
        subscriptions.get(TOPIC_CARDLESS_STATUS_UPDATE).push(obj);
    };

    /**
     * function to unsubscribe for cardless status updates.
     */
    cardless.unsubscribeCardlessStatus = function () {
        var arrayObj = subscriptions.get(TOPIC_CARDLESS_STATUS_UPDATE);

        arrayObj.forEach(function (obj) {
            obj.remove();
        });

        subscriptions.set(TOPIC_CARDLESS_STATUS_UPDATE, []);
    };

    /**
     * Gets the last known value for the cardless status
     *
     * @returns {Object} The last known value of the cardless status
     **/
    cardless.getCardlessStatus = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_CARDLESS_STATUS,
                ver: '1.0'
            }, function (data) {
                resolve(data.cardlessStatus);
            });
        });
    };

    /**
     * Gets the last cardless status History Events
     *
     * @returns {Object} The last known History Events of the cardless status
     **/
    cardless.getCardlessStatusHistory = function () {
        return new Promise(function (resolve) {
            util.sendMessage({
                cmd: TOPIC_GET_CARDLESS_STATUS_HISTORY,
                ver: '1.0'
            }, function (data) {
                resolve(data.cardlessStatusHistory);
            });
        });
    };

    return cardless;
}(IGTMediaElements.pubSub, IGTMediaElements.util);
//# sourceMappingURL=cardless-api.js.map

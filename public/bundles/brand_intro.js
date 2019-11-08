
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
let running = false;
function run_tasks() {
    tasks.forEach(task => {
        if (!task[0](now())) {
            tasks.delete(task);
            task[1]();
        }
    });
    running = tasks.size > 0;
    if (running)
        raf(run_tasks);
}
function loop(fn) {
    let task;
    if (!running) {
        running = true;
        raf(run_tasks);
    }
    return {
        promise: new Promise(fulfil => {
            tasks.add(task = [fn, fulfil]);
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    for (const key in attributes) {
        if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key in node) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let stylesheet;
let active = 0;
let current_rules = {};
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    if (!current_rules[name]) {
        if (!stylesheet) {
            const style = element('style');
            document.head.appendChild(style);
            stylesheet = style.sheet;
        }
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    node.style.animation = (node.style.animation || '')
        .split(', ')
        .filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    )
        .join(', ');
    if (name && !--active)
        clear_rules();
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        let i = stylesheet.cssRules.length;
        while (i--)
            stylesheet.deleteRule(i);
        current_rules = {};
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}

const globals = (typeof window !== 'undefined' ? window : global);

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    if (component.$$.fragment) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, prop_names) {
    const parent_component = current_component;
    set_current_component(component);
    const props = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, props, (key, ret, value = ret) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
            return ret;
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, detail));
}
function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else
        dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error(`'target' is a required option`);
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn(`Component was already destroyed`); // eslint-disable-line no-console
        };
    }
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}
function expoOut(t) {
    return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
}
function quintOut(t) {
    return --t * t * t * t * t + 1;
}

function fade(node, { delay = 0, duration = 400 }) {
    const o = +getComputedStyle(node).opacity;
    return {
        delay,
        duration,
        css: t => `opacity: ${t * o}`
    };
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
    };
}
function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
    const style = getComputedStyle(node);
    const target_opacity = +style.opacity;
    const transform = style.transform === 'none' ? '' : style.transform;
    const sd = 1 - start;
    const od = target_opacity * (1 - opacity);
    return {
        delay,
        duration,
        easing,
        css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
    };
}

/* src\lib\loading_animation.svelte generated by Svelte v3.12.1 */

const file = "src\\lib\\loading_animation.svelte";

function create_fragment(ctx) {
	var div, svg, g0, rect0, animate0, g1, rect1, animate1, g2, rect2, animate2, g3, rect3, animate3, g4, rect4, animate4, g5, rect5, animate5, g6, rect6, animate6, g7, rect7, animate7, g8, rect8, animate8, g9, rect9, animate9, g10, rect10, animate10, g11, rect11, animate11;

	const block = {
		c: function create() {
			div = element("div");
			svg = svg_element("svg");
			g0 = svg_element("g");
			rect0 = svg_element("rect");
			animate0 = svg_element("animate");
			g1 = svg_element("g");
			rect1 = svg_element("rect");
			animate1 = svg_element("animate");
			g2 = svg_element("g");
			rect2 = svg_element("rect");
			animate2 = svg_element("animate");
			g3 = svg_element("g");
			rect3 = svg_element("rect");
			animate3 = svg_element("animate");
			g4 = svg_element("g");
			rect4 = svg_element("rect");
			animate4 = svg_element("animate");
			g5 = svg_element("g");
			rect5 = svg_element("rect");
			animate5 = svg_element("animate");
			g6 = svg_element("g");
			rect6 = svg_element("rect");
			animate6 = svg_element("animate");
			g7 = svg_element("g");
			rect7 = svg_element("rect");
			animate7 = svg_element("animate");
			g8 = svg_element("g");
			rect8 = svg_element("rect");
			animate8 = svg_element("animate");
			g9 = svg_element("g");
			rect9 = svg_element("rect");
			animate9 = svg_element("animate");
			g10 = svg_element("g");
			rect10 = svg_element("rect");
			animate10 = svg_element("animate");
			g11 = svg_element("g");
			rect11 = svg_element("rect");
			animate11 = svg_element("animate");
			attr_dev(animate0, "attributeName", "opacity");
			attr_dev(animate0, "values", "1;0");
			attr_dev(animate0, "keyTimes", "0;1");
			attr_dev(animate0, "dur", "1s");
			attr_dev(animate0, "begin", "-0.9166666666666666s");
			attr_dev(animate0, "repeatCount", "indefinite");
			add_location(animate0, file, 60, 8, 1169);
			attr_dev(rect0, "x", "47.5");
			attr_dev(rect0, "y", "21");
			attr_dev(rect0, "rx", "1.425");
			attr_dev(rect0, "ry", "0.63");
			attr_dev(rect0, "width", "5");
			attr_dev(rect0, "height", "14");
			attr_dev(rect0, "fill", "#000000");
			add_location(rect0, file, 52, 6, 1024);
			attr_dev(g0, "transform", "rotate(0 50 50)");
			add_location(g0, file, 51, 4, 986);
			attr_dev(animate1, "attributeName", "opacity");
			attr_dev(animate1, "values", "1;0");
			attr_dev(animate1, "keyTimes", "0;1");
			attr_dev(animate1, "dur", "1s");
			attr_dev(animate1, "begin", "-0.8333333333333334s");
			attr_dev(animate1, "repeatCount", "indefinite");
			add_location(animate1, file, 78, 8, 1567);
			attr_dev(rect1, "x", "47.5");
			attr_dev(rect1, "y", "21");
			attr_dev(rect1, "rx", "1.425");
			attr_dev(rect1, "ry", "0.63");
			attr_dev(rect1, "width", "5");
			attr_dev(rect1, "height", "14");
			attr_dev(rect1, "fill", "#000000");
			add_location(rect1, file, 70, 6, 1422);
			attr_dev(g1, "transform", "rotate(30 50 50)");
			add_location(g1, file, 69, 4, 1383);
			attr_dev(animate2, "attributeName", "opacity");
			attr_dev(animate2, "values", "1;0");
			attr_dev(animate2, "keyTimes", "0;1");
			attr_dev(animate2, "dur", "1s");
			attr_dev(animate2, "begin", "-0.75s");
			attr_dev(animate2, "repeatCount", "indefinite");
			add_location(animate2, file, 96, 8, 1965);
			attr_dev(rect2, "x", "47.5");
			attr_dev(rect2, "y", "21");
			attr_dev(rect2, "rx", "1.425");
			attr_dev(rect2, "ry", "0.63");
			attr_dev(rect2, "width", "5");
			attr_dev(rect2, "height", "14");
			attr_dev(rect2, "fill", "#000000");
			add_location(rect2, file, 88, 6, 1820);
			attr_dev(g2, "transform", "rotate(60 50 50)");
			add_location(g2, file, 87, 4, 1781);
			attr_dev(animate3, "attributeName", "opacity");
			attr_dev(animate3, "values", "1;0");
			attr_dev(animate3, "keyTimes", "0;1");
			attr_dev(animate3, "dur", "1s");
			attr_dev(animate3, "begin", "-0.6666666666666666s");
			attr_dev(animate3, "repeatCount", "indefinite");
			add_location(animate3, file, 114, 8, 2349);
			attr_dev(rect3, "x", "47.5");
			attr_dev(rect3, "y", "21");
			attr_dev(rect3, "rx", "1.425");
			attr_dev(rect3, "ry", "0.63");
			attr_dev(rect3, "width", "5");
			attr_dev(rect3, "height", "14");
			attr_dev(rect3, "fill", "#000000");
			add_location(rect3, file, 106, 6, 2204);
			attr_dev(g3, "transform", "rotate(90 50 50)");
			add_location(g3, file, 105, 4, 2165);
			attr_dev(animate4, "attributeName", "opacity");
			attr_dev(animate4, "values", "1;0");
			attr_dev(animate4, "keyTimes", "0;1");
			attr_dev(animate4, "dur", "1s");
			attr_dev(animate4, "begin", "-0.5833333333333334s");
			attr_dev(animate4, "repeatCount", "indefinite");
			add_location(animate4, file, 132, 8, 2748);
			attr_dev(rect4, "x", "47.5");
			attr_dev(rect4, "y", "21");
			attr_dev(rect4, "rx", "1.425");
			attr_dev(rect4, "ry", "0.63");
			attr_dev(rect4, "width", "5");
			attr_dev(rect4, "height", "14");
			attr_dev(rect4, "fill", "#000000");
			add_location(rect4, file, 124, 6, 2603);
			attr_dev(g4, "transform", "rotate(120 50 50)");
			add_location(g4, file, 123, 4, 2563);
			attr_dev(animate5, "attributeName", "opacity");
			attr_dev(animate5, "values", "1;0");
			attr_dev(animate5, "keyTimes", "0;1");
			attr_dev(animate5, "dur", "1s");
			attr_dev(animate5, "begin", "-0.5s");
			attr_dev(animate5, "repeatCount", "indefinite");
			add_location(animate5, file, 150, 8, 3147);
			attr_dev(rect5, "x", "47.5");
			attr_dev(rect5, "y", "21");
			attr_dev(rect5, "rx", "1.425");
			attr_dev(rect5, "ry", "0.63");
			attr_dev(rect5, "width", "5");
			attr_dev(rect5, "height", "14");
			attr_dev(rect5, "fill", "#000000");
			add_location(rect5, file, 142, 6, 3002);
			attr_dev(g5, "transform", "rotate(150 50 50)");
			add_location(g5, file, 141, 4, 2962);
			attr_dev(animate6, "attributeName", "opacity");
			attr_dev(animate6, "values", "1;0");
			attr_dev(animate6, "keyTimes", "0;1");
			attr_dev(animate6, "dur", "1s");
			attr_dev(animate6, "begin", "-0.4166666666666667s");
			attr_dev(animate6, "repeatCount", "indefinite");
			add_location(animate6, file, 168, 8, 3531);
			attr_dev(rect6, "x", "47.5");
			attr_dev(rect6, "y", "21");
			attr_dev(rect6, "rx", "1.425");
			attr_dev(rect6, "ry", "0.63");
			attr_dev(rect6, "width", "5");
			attr_dev(rect6, "height", "14");
			attr_dev(rect6, "fill", "#000000");
			add_location(rect6, file, 160, 6, 3386);
			attr_dev(g6, "transform", "rotate(180 50 50)");
			add_location(g6, file, 159, 4, 3346);
			attr_dev(animate7, "attributeName", "opacity");
			attr_dev(animate7, "values", "1;0");
			attr_dev(animate7, "keyTimes", "0;1");
			attr_dev(animate7, "dur", "1s");
			attr_dev(animate7, "begin", "-0.3333333333333333s");
			attr_dev(animate7, "repeatCount", "indefinite");
			add_location(animate7, file, 186, 8, 3930);
			attr_dev(rect7, "x", "47.5");
			attr_dev(rect7, "y", "21");
			attr_dev(rect7, "rx", "1.425");
			attr_dev(rect7, "ry", "0.63");
			attr_dev(rect7, "width", "5");
			attr_dev(rect7, "height", "14");
			attr_dev(rect7, "fill", "#000000");
			add_location(rect7, file, 178, 6, 3785);
			attr_dev(g7, "transform", "rotate(210 50 50)");
			add_location(g7, file, 177, 4, 3745);
			attr_dev(animate8, "attributeName", "opacity");
			attr_dev(animate8, "values", "1;0");
			attr_dev(animate8, "keyTimes", "0;1");
			attr_dev(animate8, "dur", "1s");
			attr_dev(animate8, "begin", "-0.25s");
			attr_dev(animate8, "repeatCount", "indefinite");
			add_location(animate8, file, 204, 8, 4329);
			attr_dev(rect8, "x", "47.5");
			attr_dev(rect8, "y", "21");
			attr_dev(rect8, "rx", "1.425");
			attr_dev(rect8, "ry", "0.63");
			attr_dev(rect8, "width", "5");
			attr_dev(rect8, "height", "14");
			attr_dev(rect8, "fill", "#000000");
			add_location(rect8, file, 196, 6, 4184);
			attr_dev(g8, "transform", "rotate(240 50 50)");
			add_location(g8, file, 195, 4, 4144);
			attr_dev(animate9, "attributeName", "opacity");
			attr_dev(animate9, "values", "1;0");
			attr_dev(animate9, "keyTimes", "0;1");
			attr_dev(animate9, "dur", "1s");
			attr_dev(animate9, "begin", "-0.16666666666666666s");
			attr_dev(animate9, "repeatCount", "indefinite");
			add_location(animate9, file, 222, 8, 4714);
			attr_dev(rect9, "x", "47.5");
			attr_dev(rect9, "y", "21");
			attr_dev(rect9, "rx", "1.425");
			attr_dev(rect9, "ry", "0.63");
			attr_dev(rect9, "width", "5");
			attr_dev(rect9, "height", "14");
			attr_dev(rect9, "fill", "#000000");
			add_location(rect9, file, 214, 6, 4569);
			attr_dev(g9, "transform", "rotate(270 50 50)");
			add_location(g9, file, 213, 4, 4529);
			attr_dev(animate10, "attributeName", "opacity");
			attr_dev(animate10, "values", "1;0");
			attr_dev(animate10, "keyTimes", "0;1");
			attr_dev(animate10, "dur", "1s");
			attr_dev(animate10, "begin", "-0.08333333333333333s");
			attr_dev(animate10, "repeatCount", "indefinite");
			add_location(animate10, file, 240, 8, 5114);
			attr_dev(rect10, "x", "47.5");
			attr_dev(rect10, "y", "21");
			attr_dev(rect10, "rx", "1.425");
			attr_dev(rect10, "ry", "0.63");
			attr_dev(rect10, "width", "5");
			attr_dev(rect10, "height", "14");
			attr_dev(rect10, "fill", "#000000");
			add_location(rect10, file, 232, 6, 4969);
			attr_dev(g10, "transform", "rotate(300 50 50)");
			add_location(g10, file, 231, 4, 4929);
			attr_dev(animate11, "attributeName", "opacity");
			attr_dev(animate11, "values", "1;0");
			attr_dev(animate11, "keyTimes", "0;1");
			attr_dev(animate11, "dur", "1s");
			attr_dev(animate11, "begin", "0s");
			attr_dev(animate11, "repeatCount", "indefinite");
			add_location(animate11, file, 258, 8, 5514);
			attr_dev(rect11, "x", "47.5");
			attr_dev(rect11, "y", "21");
			attr_dev(rect11, "rx", "1.425");
			attr_dev(rect11, "ry", "0.63");
			attr_dev(rect11, "width", "5");
			attr_dev(rect11, "height", "14");
			attr_dev(rect11, "fill", "#000000");
			add_location(rect11, file, 250, 6, 5369);
			attr_dev(g11, "transform", "rotate(330 50 50)");
			add_location(g11, file, 249, 4, 5329);
			attr_dev(svg, "width", ctx.width);
			attr_dev(svg, "height", ctx.height);
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "xmlnsxlink", "http://www.w3.org/1999/xlink");
			attr_dev(svg, "viewBox", "0 0 100 100");
			attr_dev(svg, "preserveAspectRatio", "xMidYMid");
			attr_dev(svg, "class", "svelte-qf50dn");
			add_location(svg, file, 44, 2, 805);
			attr_dev(div, "class", "processingAnimation svelte-qf50dn");
			toggle_class(div, "immediate", ctx.immediate);
			add_location(div, file, 42, 0, 692);
		},

		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, svg);
			append_dev(svg, g0);
			append_dev(g0, rect0);
			append_dev(rect0, animate0);
			append_dev(svg, g1);
			append_dev(g1, rect1);
			append_dev(rect1, animate1);
			append_dev(svg, g2);
			append_dev(g2, rect2);
			append_dev(rect2, animate2);
			append_dev(svg, g3);
			append_dev(g3, rect3);
			append_dev(rect3, animate3);
			append_dev(svg, g4);
			append_dev(g4, rect4);
			append_dev(rect4, animate4);
			append_dev(svg, g5);
			append_dev(g5, rect5);
			append_dev(rect5, animate5);
			append_dev(svg, g6);
			append_dev(g6, rect6);
			append_dev(rect6, animate6);
			append_dev(svg, g7);
			append_dev(g7, rect7);
			append_dev(rect7, animate7);
			append_dev(svg, g8);
			append_dev(g8, rect8);
			append_dev(rect8, animate8);
			append_dev(svg, g9);
			append_dev(g9, rect9);
			append_dev(rect9, animate9);
			append_dev(svg, g10);
			append_dev(g10, rect10);
			append_dev(rect10, animate10);
			append_dev(svg, g11);
			append_dev(g11, rect11);
			append_dev(rect11, animate11);
		},

		p: function update(changed, ctx) {
			if (changed.width) {
				attr_dev(svg, "width", ctx.width);
			}

			if (changed.height) {
				attr_dev(svg, "height", ctx.height);
			}

			if (changed.immediate) {
				toggle_class(div, "immediate", ctx.immediate);
			}
		},

		i: noop,
		o: noop,

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { width = "100%", height = "100%", immediate = false } = $$props;

	const writable_props = ['width', 'height', 'immediate'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Loading_animation> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ('width' in $$props) $$invalidate('width', width = $$props.width);
		if ('height' in $$props) $$invalidate('height', height = $$props.height);
		if ('immediate' in $$props) $$invalidate('immediate', immediate = $$props.immediate);
	};

	$$self.$capture_state = () => {
		return { width, height, immediate };
	};

	$$self.$inject_state = $$props => {
		if ('width' in $$props) $$invalidate('width', width = $$props.width);
		if ('height' in $$props) $$invalidate('height', height = $$props.height);
		if ('immediate' in $$props) $$invalidate('immediate', immediate = $$props.immediate);
	};

	return { width, height, immediate };
}

class Loading_animation extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, ["width", "height", "immediate"]);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Loading_animation", options, id: create_fragment.name });
	}

	get width() {
		throw new Error("<Loading_animation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Loading_animation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get height() {
		throw new Error("<Loading_animation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set height(value) {
		throw new Error("<Loading_animation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get immediate() {
		throw new Error("<Loading_animation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set immediate(value) {
		throw new Error("<Loading_animation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\lib\interaction.svelte generated by Svelte v3.12.1 */
const { Error: Error_1 } = globals;

const file$1 = "src\\lib\\interaction.svelte";

// (76:2) {#if pending}
function create_if_block(ctx) {
	var current;

	var loadinganimation = new Loading_animation({ $$inline: true });

	const block = {
		c: function create() {
			loadinganimation.$$.fragment.c();
		},

		m: function mount(target, anchor) {
			mount_component(loadinganimation, target, anchor);
			current = true;
		},

		i: function intro(local) {
			if (current) return;
			transition_in(loadinganimation.$$.fragment, local);

			current = true;
		},

		o: function outro(local) {
			transition_out(loadinganimation.$$.fragment, local);
			current = false;
		},

		d: function destroy(detaching) {
			destroy_component(loadinganimation, detaching);
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(76:2) {#if pending}", ctx });
	return block;
}

function create_fragment$1(ctx) {
	var form, t, form_intro, form_outro, current, dispose;

	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	var if_block = (ctx.pending) && create_if_block(ctx);

	var form_levels = [
		ctx.$$props,
		{ class: "svelte-14bw22b" }
	];

	var form_data = {};
	for (var i = 0; i < form_levels.length; i += 1) {
		form_data = assign(form_data, form_levels[i]);
	}

	const block = {
		c: function create() {
			form = element("form");

			if (default_slot) default_slot.c();
			t = space();
			if (if_block) if_block.c();

			set_attributes(form, form_data);
			add_location(form, file$1, 68, 0, 1822);
			dispose = listen_dev(form, "submit", ctx.superHandler);
		},

		l: function claim(nodes) {
			if (default_slot) default_slot.l(form_nodes);
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			insert_dev(target, form, anchor);

			if (default_slot) {
				default_slot.m(form, null);
			}

			append_dev(form, t);
			if (if_block) if_block.m(form, null);
			ctx.form_binding(form);
			current = true;
		},

		p: function update(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(
					get_slot_changes(default_slot_template, ctx, changed, null),
					get_slot_context(default_slot_template, ctx, null)
				);
			}

			if (ctx.pending) {
				if (!if_block) {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(form, null);
				} else transition_in(if_block, 1);
			} else if (if_block) {
				group_outros();
				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});
				check_outros();
			}

			set_attributes(form, get_spread_update(form_levels, [
				(changed.$$props) && ctx.$$props,
				{ class: "svelte-14bw22b" }
			]));
		},

		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			transition_in(if_block);

			add_render_callback(() => {
				if (form_outro) form_outro.end(1);
				if (!form_intro) form_intro = create_in_transition(form, fly, { y: 50, duration: 1600, easing: quintOut });
				form_intro.start();
			});

			current = true;
		},

		o: function outro(local) {
			transition_out(default_slot, local);
			transition_out(if_block);
			if (form_intro) form_intro.invalidate();

			form_outro = create_out_transition(form, scale, { duration: 1600, opacity: 0.9, start: 0, easing: expoOut });

			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(form);
			}

			if (default_slot) default_slot.d(detaching);
			if (if_block) if_block.d();
			ctx.form_binding(null);

			if (detaching) {
				if (form_outro) form_outro.end();
			}

			dispose();
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	

  // handler is a Function that returns a Promise,
  // if you don't provide one, this default handler resolves immediately.
  let { handler = function() {
    return new Promise(function(resolve, reject) {
      resolve();
    });
  } } = $$props;

  let pending = false;
  let move_to_next_question_interval_id;

  function superHandler(event) {
    event.preventDefault();
    $$invalidate('pending', pending = true);
    if (typeof handler === "function") {
      handler(event);
    } else {
      throw new Error("Please send in a handler function");
    }
  }
  // OLD
  // function handleSubmission(event) {
  //   // Store the Input given by the user to the Prompt.
  //   use r_inputs.update(function(I) {
  //     const n = {};
  //     n[event.target.id] = document.activeElement.value;
  //     return { ...I, ...n };
  //   });
  //   //
  //   // TODO what if i need to roll back?
  //   //
  //   if (typeof handler === "function") {
  //     const h = handler(event);
  //     if (h instanceof Promise) {
  //       h.then().catch();
  //     }
  //   }
  // }
  // let _store = JSON.stringify($use r_inputs);

  let component;
  onMount(function(o) {
    let i = component.querySelector("input");
    if (i && i.nodeName === "INPUT") {
      i.focus();
    }
    // todo <select>, <button>, <a>, any focusable ...
  });

	let { $$slots = {}, $$scope } = $$props;

	function form_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			$$invalidate('component', component = $$value);
		});
	}

	$$self.$set = $$new_props => {
		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
		if ('handler' in $$new_props) $$invalidate('handler', handler = $$new_props.handler);
		if ('$$scope' in $$new_props) $$invalidate('$$scope', $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => {
		return { handler, pending, move_to_next_question_interval_id, component };
	};

	$$self.$inject_state = $$new_props => {
		$$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
		if ('handler' in $$props) $$invalidate('handler', handler = $$new_props.handler);
		if ('pending' in $$props) $$invalidate('pending', pending = $$new_props.pending);
		if ('move_to_next_question_interval_id' in $$props) move_to_next_question_interval_id = $$new_props.move_to_next_question_interval_id;
		if ('component' in $$props) $$invalidate('component', component = $$new_props.component);
	};

	return {
		handler,
		pending,
		superHandler,
		component,
		$$props,
		form_binding,
		$$props: $$props = exclude_internal_props($$props),
		$$slots,
		$$scope
	};
}

class Interaction extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["handler"]);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Interaction", options, id: create_fragment$1.name });
	}

	get handler() {
		throw new Error_1("<Interaction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set handler(value) {
		throw new Error_1("<Interaction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\lib\prompt.svelte generated by Svelte v3.12.1 */

const file$2 = "src\\lib\\prompt.svelte";

function create_fragment$2(ctx) {
	var label, current;

	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	const block = {
		c: function create() {
			label = element("label");

			if (default_slot) default_slot.c();

			attr_dev(label, "class", "svelte-csa57l");
			add_location(label, file$2, 10, 0, 100);
		},

		l: function claim(nodes) {
			if (default_slot) default_slot.l(label_nodes);
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			insert_dev(target, label, anchor);

			if (default_slot) {
				default_slot.m(label, null);
			}

			current = true;
		},

		p: function update(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(
					get_slot_changes(default_slot_template, ctx, changed, null),
					get_slot_context(default_slot_template, ctx, null)
				);
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},

		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(label);
			}

			if (default_slot) default_slot.d(detaching);
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {};

	return { $$slots, $$scope };
}

class Prompt extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, []);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Prompt", options, id: create_fragment$2.name });
	}
}

/* src\lib\inputs.svelte generated by Svelte v3.12.1 */

const file$3 = "src\\lib\\inputs.svelte";

function create_fragment$3(ctx) {
	var div, current;

	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	const block = {
		c: function create() {
			div = element("div");

			if (default_slot) default_slot.c();

			attr_dev(div, "class", "inputs");
			add_location(div, file$3, 49, 0, 967);
		},

		l: function claim(nodes) {
			if (default_slot) default_slot.l(div_nodes);
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},

		p: function update(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(
					get_slot_changes(default_slot_template, ctx, changed, null),
					get_slot_context(default_slot_template, ctx, null)
				);
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},

		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			if (default_slot) default_slot.d(detaching);
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return {};
	};

	$$self.$inject_state = $$props => {};

	return { $$slots, $$scope };
}

class Inputs extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Inputs", options, id: create_fragment$3.name });
	}
}

/* src\lib\input_address.svelte generated by Svelte v3.12.1 */
const { console: console_1 } = globals;

const file$4 = "src\\lib\\input_address.svelte";

function create_fragment$4(ctx) {
	var input_1;

	const block = {
		c: function create() {
			input_1 = element("input");
			input_1.value = ctx.value;
			attr_dev(input_1, "placeholder", ctx.placeholder);
			add_location(input_1, file$4, 50, 0, 1868);
		},

		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			insert_dev(target, input_1, anchor);
			ctx.input_1_binding(input_1);
		},

		p: function update(changed, ctx) {
			if (changed.value) {
				prop_dev(input_1, "value", ctx.value);
			}

			if (changed.placeholder) {
				attr_dev(input_1, "placeholder", ctx.placeholder);
			}
		},

		i: noop,
		o: noop,

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(input_1);
			}

			ctx.input_1_binding(null);
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { placeholder = "123", value = "" } = $$props;
  let input;
  let { fillInAddress = function(place) {
    console.log("Implement this reducer on the parent component");
  } } = $$props;

  onMount(function() {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      !window.google.maps.places.Autocomplete
    ) {
      const s = document.createElement("script");
      s.src = `//maps.googleapis.com/maps/api/js?key=AIzaSyDiG0YGqQbnCGxnKGn7MQMOSfckHWU12_Q&libraries=places`;
      s.onload = instantiateAddressAutocomplete;
      document.head.appendChild(s);
    } else {
      instantiateAddressAutocomplete();
    }
    return function cleanup() {
      // console.log('Cleanup goes here');
    };
  });
  function instantiateAddressAutocomplete() {
    if (!input) return console.warn("Unable to start AddressAutocomplete");
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["geocode"]
    });
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(["address_component"]);
    // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-multiple-countries
    autocomplete.setComponentRestrictions({
      // USA, Puerto Rico, U.S. Virgin Islands, Guam, Northern Mariana Islands
      country: ["us", "pr", "vi", "gu", "mp"]
    });
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", function() {
      fillInAddress(autocomplete.getPlace());
    });
  }

	const writable_props = ['placeholder', 'value', 'fillInAddress'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Input_address> was created with unknown prop '${key}'`);
	});

	function input_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			$$invalidate('input', input = $$value);
		});
	}

	$$self.$set = $$props => {
		if ('placeholder' in $$props) $$invalidate('placeholder', placeholder = $$props.placeholder);
		if ('value' in $$props) $$invalidate('value', value = $$props.value);
		if ('fillInAddress' in $$props) $$invalidate('fillInAddress', fillInAddress = $$props.fillInAddress);
	};

	$$self.$capture_state = () => {
		return { placeholder, value, input, fillInAddress };
	};

	$$self.$inject_state = $$props => {
		if ('placeholder' in $$props) $$invalidate('placeholder', placeholder = $$props.placeholder);
		if ('value' in $$props) $$invalidate('value', value = $$props.value);
		if ('input' in $$props) $$invalidate('input', input = $$props.input);
		if ('fillInAddress' in $$props) $$invalidate('fillInAddress', fillInAddress = $$props.fillInAddress);
	};

	return {
		placeholder,
		value,
		input,
		fillInAddress,
		input_1_binding
	};
}

class Input_address extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["placeholder", "value", "fillInAddress"]);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Input_address", options, id: create_fragment$4.name });
	}

	get placeholder() {
		throw new Error("<Input_address>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set placeholder(value) {
		throw new Error("<Input_address>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<Input_address>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<Input_address>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fillInAddress() {
		throw new Error("<Input_address>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fillInAddress(value) {
		throw new Error("<Input_address>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\lib\feedback.svelte generated by Svelte v3.12.1 */

const file$5 = "src\\lib\\feedback.svelte";

// (14:0) {#if is_showing_feedback}
function create_if_block$1(ctx) {
	var div, div_intro, div_outro, current;

	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	const block = {
		c: function create() {
			div = element("div");

			if (default_slot) default_slot.c();

			attr_dev(div, "class", "feedback");
			add_location(div, file$5, 14, 2, 196);
		},

		l: function claim(nodes) {
			if (default_slot) default_slot.l(div_nodes);
		},

		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},

		p: function update(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(
					get_slot_changes(default_slot_template, ctx, changed, null),
					get_slot_context(default_slot_template, ctx, null)
				);
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (div_outro) div_outro.end(1);
				if (!div_intro) div_intro = create_in_transition(div, fade, {});
				div_intro.start();
			});

			current = true;
		},

		o: function outro(local) {
			transition_out(default_slot, local);
			if (div_intro) div_intro.invalidate();

			div_outro = create_out_transition(div, fade, {});

			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			if (default_slot) default_slot.d(detaching);

			if (detaching) {
				if (div_outro) div_outro.end();
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(14:0) {#if is_showing_feedback}", ctx });
	return block;
}

function create_fragment$5(ctx) {
	var if_block_anchor, current;

	var if_block = (ctx.is_showing_feedback) && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},

		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},

		p: function update(changed, ctx) {
			if (ctx.is_showing_feedback) {
				if (if_block) {
					if_block.p(changed, ctx);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();
				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});
				check_outros();
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},

		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},

		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);

			if (detaching) {
				detach_dev(if_block_anchor);
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let { is_showing_feedback = false } = $$props; // TODO

	const writable_props = ['is_showing_feedback'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Feedback> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ('is_showing_feedback' in $$props) $$invalidate('is_showing_feedback', is_showing_feedback = $$props.is_showing_feedback);
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { is_showing_feedback };
	};

	$$self.$inject_state = $$props => {
		if ('is_showing_feedback' in $$props) $$invalidate('is_showing_feedback', is_showing_feedback = $$props.is_showing_feedback);
	};

	return { is_showing_feedback, $$slots, $$scope };
}

class Feedback extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["is_showing_feedback"]);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Feedback", options, id: create_fragment$5.name });
	}

	get is_showing_feedback() {
		throw new Error("<Feedback>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set is_showing_feedback(value) {
		throw new Error("<Feedback>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\lib\error_message.svelte generated by Svelte v3.12.1 */

const file$6 = "src\\lib\\error_message.svelte";

// (13:0) {#if code}
function create_if_block$2(ctx) {
	var div, div_intro, div_outro, current;

	const default_slot_template = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_template, ctx, null);

	const block = {
		c: function create() {
			div = element("div");

			if (default_slot) default_slot.c();

			attr_dev(div, "class", "error svelte-1fi3y4c");
			add_location(div, file$6, 13, 2, 148);
		},

		l: function claim(nodes) {
			if (default_slot) default_slot.l(div_nodes);
		},

		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},

		p: function update(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(
					get_slot_changes(default_slot_template, ctx, changed, null),
					get_slot_context(default_slot_template, ctx, null)
				);
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (div_outro) div_outro.end(1);
				if (!div_intro) div_intro = create_in_transition(div, fade, {});
				div_intro.start();
			});

			current = true;
		},

		o: function outro(local) {
			transition_out(default_slot, local);
			if (div_intro) div_intro.invalidate();

			div_outro = create_out_transition(div, fade, {});

			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(div);
			}

			if (default_slot) default_slot.d(detaching);

			if (detaching) {
				if (div_outro) div_outro.end();
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$2.name, type: "if", source: "(13:0) {#if code}", ctx });
	return block;
}

function create_fragment$6(ctx) {
	var if_block_anchor, current;

	var if_block = (ctx.code) && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},

		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},

		p: function update(changed, ctx) {
			if (ctx.code) {
				if (if_block) {
					if_block.p(changed, ctx);
					transition_in(if_block, 1);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();
				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});
				check_outros();
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},

		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},

		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);

			if (detaching) {
				detach_dev(if_block_anchor);
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { code } = $$props;

	const writable_props = ['code'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Error_message> was created with unknown prop '${key}'`);
	});

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ('code' in $$props) $$invalidate('code', code = $$props.code);
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => {
		return { code };
	};

	$$self.$inject_state = $$props => {
		if ('code' in $$props) $$invalidate('code', code = $$props.code);
	};

	return { code, $$slots, $$scope };
}

class Error_message extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["code"]);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Error_message", options, id: create_fragment$6.name });

		const { ctx } = this.$$;
		const props = options.props || {};
		if (ctx.code === undefined && !('code' in props)) {
			console.warn("<Error_message> was created without expected prop 'code'");
		}
	}

	get code() {
		throw new Error("<Error_message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set code(value) {
		throw new Error("<Error_message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

Object.freeze({
  Interaction,
  Prompt,
  Inputs,
  InputAddress: Input_address,
  Feedback,
  ErrorMessage: Error_message
});

/* src\interaction_components\brand_intro.svelte generated by Svelte v3.12.1 */
const { console: console_1$1 } = globals;

const file$7 = "src\\interaction_components\\brand_intro.svelte";

// (34:0) {#if showing}
function create_if_block$3(ctx) {
	var h1, h1_intro, h1_outro, current;

	const block = {
		c: function create() {
			h1 = element("h1");
			h1.textContent = "BRAND";
			attr_dev(h1, "class", "svelte-1vjeua6");
			add_location(h1, file$7, 34, 2, 661);
		},

		m: function mount(target, anchor) {
			insert_dev(target, h1, anchor);
			current = true;
		},

		i: function intro(local) {
			if (current) return;
			add_render_callback(() => {
				if (h1_outro) h1_outro.end(1);
				if (!h1_intro) h1_intro = create_in_transition(h1, fade, {});
				h1_intro.start();
			});

			current = true;
		},

		o: function outro(local) {
			if (h1_intro) h1_intro.invalidate();

			h1_outro = create_out_transition(h1, fade, {});

			current = false;
		},

		d: function destroy(detaching) {
			if (detaching) {
				detach_dev(h1);
				if (h1_outro) h1_outro.end();
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$3.name, type: "if", source: "(34:0) {#if showing}", ctx });
	return block;
}

function create_fragment$7(ctx) {
	var if_block_anchor, current;

	var if_block = (ctx.showing) && create_if_block$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},

		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},

		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},

		p: function update(changed, ctx) {
			if (ctx.showing) {
				if (!if_block) {
					if_block = create_if_block$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				} else transition_in(if_block, 1);
			} else if (if_block) {
				group_outros();
				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});
				check_outros();
			}
		},

		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},

		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},

		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);

			if (detaching) {
				detach_dev(if_block_anchor);
			}
		}
	};
	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
	return block;
}

function instance$7($$self, $$props, $$invalidate) {

  console.log("Brand intro in the house!!");

  let { callback = function() {} } = $$props;
  let { props } = $$props;

  let showing = false;
  onMount(function() {
    $$invalidate('showing', showing = true);
  });
  const clearer = setTimeout(function() {
    callback(true);
  }, 3000);
  onDestroy(function() {
    clearTimeout(clearer);
  });

	const writable_props = ['callback', 'props'];
	Object.keys($$props).forEach(key => {
		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$1.warn(`<Brand_intro> was created with unknown prop '${key}'`);
	});

	$$self.$set = $$props => {
		if ('callback' in $$props) $$invalidate('callback', callback = $$props.callback);
		if ('props' in $$props) $$invalidate('props', props = $$props.props);
	};

	$$self.$capture_state = () => {
		return { callback, props, showing };
	};

	$$self.$inject_state = $$props => {
		if ('callback' in $$props) $$invalidate('callback', callback = $$props.callback);
		if ('props' in $$props) $$invalidate('props', props = $$props.props);
		if ('showing' in $$props) $$invalidate('showing', showing = $$props.showing);
	};

	return { callback, props, showing };
}

class Brand_intro extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$7, safe_not_equal, ["callback", "props"]);
		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Brand_intro", options, id: create_fragment$7.name });

		const { ctx } = this.$$;
		const props = options.props || {};
		if (ctx.props === undefined && !('props' in props)) {
			console_1$1.warn("<Brand_intro> was created without expected prop 'props'");
		}
	}

	get callback() {
		throw new Error("<Brand_intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set callback(value) {
		throw new Error("<Brand_intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get props() {
		throw new Error("<Brand_intro>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set props(value) {
		throw new Error("<Brand_intro>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Brand_intro;


(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, callback) {
        const unsub = store.subscribe(callback);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function text(data) {
        return document.createTextNode(data);
    }
    function empty() {
        return text('');
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    /**
     * Derived value store by synchronizing one or more readable stores and
     * applying an aggregation function over its input values.
     * @param {Stores} stores input stores
     * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
     * @param {*=}initial_value when used asynchronously
     */
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    // parseq.js
    // Douglas Crockford
    // 2018-09-05

    // Better living thru eventuality!

    // You can access the parseq object in your module by importing it.
    //      import parseq from "./parseq.js";

    /*jslint node */

    /*property
        concat, create, evidence, fallback, forEach, freeze, isArray, isSafeInteger,
        keys, length, min, parallel, parallel_object, pop, push, race, sequence,
        some
    */

    function make_reason(factory_name, excuse, evidence) {

    // Make a reason object. These are used for exceptions and cancellations.
    // They are made from Error objects.

        const reason = new Error("parseq." + factory_name + (
            excuse === undefined
            ? ""
            : ": " + excuse
        ));
        reason.evidence = evidence;
        return reason;
    }

    function check_callback(callback, factory_name) {
        if (typeof callback !== "function" || callback.length !== 2) {
            throw make_reason(factory_name, "Not a callback.", callback);
        }
    }

    function check_requestor_array(requestor_array, factory_name) {

    // A requestor array contains only requestors. A requestor is a function that
    // takes wun or two arguments: 'callback' and optionally 'initial_value'.

        if (
            !Array.isArray(requestor_array)
            || requestor_array.length < 1
            || requestor_array.some(function (requestor) {
                return (
                    typeof requestor !== "function"
                    || requestor.length < 1
                    || requestor.length > 2
                );
            })
        ) {
            throw make_reason(
                factory_name,
                "Bad requestors array.",
                requestor_array
            );
        }
    }

    function run$1(
        factory_name,
        requestor_array,
        initial_value,
        action,
        timeout,
        time_limit,
        throttle = 0
    ) {

    // The 'run' function does the work that is common to all of the Parseq
    // factories. It takes the name of the factory, an array of requestors, an
    // initial value, an action callback, a timeout callback, a time limit in
    // milliseconds, and a throttle.

    // If all goes well, we call all of the requestor functions in the array. Each
    // of them  might return a cancel function that is kept in the 'cancel_array'.

        let cancel_array = new Array(requestor_array.length);
        let next_number = 0;
        let timer_id;

    // We need 'cancel' and 'start_requestor' functions.

        function cancel(reason = make_reason(factory_name, "Cancel.")) {

    // Stop all unfinished business. This can be called when a requestor fails.
    // It can also be called when a requestor succeeds, such as 'race' stopping
    // its losers, or 'parallel' stopping the unfinished optionals.

    // If a timer is running, stop it.

            if (timer_id !== undefined) {
                clearTimeout(timer_id);
                timer_id = undefined;
            }

    // If anything is still going, cancel it.

            if (cancel_array !== undefined) {
                cancel_array.forEach(function (cancel) {
                    try {
                        if (typeof cancel === "function") {
                            return cancel(reason);
                        }
                    } catch (ignore) {}
                });
                cancel_array = undefined;
            }
        }

        function start_requestor(value) {

    // The 'start_requestor' function is not recursive, exactly. It does not
    // directly call itself, but it does return a function that might call
    // 'start_requestor'.

    // Start the execution of a requestor, if there are any still waiting.

            if (
                cancel_array !== undefined
                && next_number < requestor_array.length
            ) {

    // Each requestor has a number.

                let number = next_number;
                next_number += 1;

    // Call the next requestor, passing in a callback function,
    // saving the cancel function that the requestor might return.

                const requestor = requestor_array[number];
                try {
                    cancel_array[number] = requestor(
                        function start_requestor_callback(value, reason) {

    // This callback function is called by the 'requestor' when it is done.
    // If we are no longer running, then this call is ignored.
    // For example, it might be a result that is sent back after the time
    // limit has expired. This callback function can only be called wunce.

                            if (
                                cancel_array !== undefined
                                && number !== undefined
                            ) {

    // We no longer need the cancel associated with this requestor.

                                cancel_array[number] = undefined;

    // Call the 'action' function to let the requestor know what happened.

                                action(value, reason, number);

    // Clear 'number' so this callback can not be used again.

                                number = undefined;

    // If there are any requestors that are still waiting to start, then
    // start the next wun. If the next requestor is in a sequence, then it
    // gets the most recent 'value'. The others get the 'initial_value'.

                                return start_requestor(
                                    factory_name === "sequence"
                                    ? value
                                    : initial_value
                                );
                            }
                        },
                        value
                    );

    // Requestors are required to report their failure thru the callback.
    // They are not allowed to throw exceptions. If we happen to catch wun,
    // it is treated as a failure.

                } catch (exception) {
                    action(undefined, exception, number);
                    number = undefined;
                    start_requestor(value);
                }
            }
        }

    // With the 'cancel' and the 'start_requestor' functions in hand,
    // we can now get to work.

    // If a timeout was requested, start the timer.

        if (time_limit !== undefined) {
            if (typeof time_limit === "number" && time_limit >= 0) {
                if (time_limit > 0) {
                    timer_id = setTimeout(timeout, time_limit);
                }
            } else {
                throw make_reason(factory_name, "Bad time limit.", time_limit);
            }
        }

    // If we are doing 'race' or 'parallel', we want to start all of the requestors
    // at wunce. However, if there is a 'throttle' in place then we start as many
    // as the 'throttle' allows, and then as each requestor finishes, another is
    // started.

    // The 'sequence' and 'fallback' factories set 'throttle' to 1 because they
    // process wun at a time and always start another requestor when the
    // previous requestor finishes.

        if (!Number.isSafeInteger(throttle) || throttle < 0) {
            throw make_reason(factory_name, "Bad throttle.", throttle);
        }
        let repeat = Math.min(throttle || Infinity, requestor_array.length);
        while (repeat > 0) {
            setTimeout(start_requestor, 0, initial_value);
            repeat -= 1;
        }

    // We return 'cancel' which allows the requestor to cancel this work.

        return cancel;
    }

    // The factories ///////////////////////////////////////////////////////////////

    function parallel(
        required_array,
        optional_array,
        time_limit,
        time_option,
        throttle,
        factory_name = "parallel"
    ) {

    // The parallel factory is the most complex of these factories. It can take
    // a second array of requestors that get a more forgiving failure policy.
    // It returns a requestor that produces an array of values.

        let number_of_required;
        let requestor_array;

    // There are four cases because 'required_array' and 'optional_array'
    // can both be empty.

        if (required_array === undefined || required_array.length === 0) {
            number_of_required = 0;
            if (optional_array === undefined || optional_array.length === 0) {

    // If both are empty, then there is probably a mistake.

                throw make_reason(
                    factory_name,
                    "Missing requestor array.",
                    required_array
                );
            }

    // If there is only 'optional_array', then it is the 'requestor_array'.

            requestor_array = optional_array;
            time_option = true;
        } else {

    // If there is only 'required_array', then it is the 'requestor_array'.

            number_of_required = required_array.length;
            if (optional_array === undefined || optional_array.length === 0) {
                requestor_array = required_array;
                time_option = undefined;

    // If both arrays are provided, we concatenate them together.

            } else {
                requestor_array = required_array.concat(optional_array);
                if (time_option !== undefined && typeof time_option !== "boolean") {
                    throw make_reason(
                        factory_name,
                        "Bad time_option.",
                        time_option
                    );
                }
            }
        }

    // We check the array and return the requestor.

        check_requestor_array(requestor_array, factory_name);
        return function parallel_requestor(callback, initial_value) {
            check_callback(callback, factory_name);
            let number_of_pending = requestor_array.length;
            let number_of_pending_required = number_of_required;
            let results = [];

    // 'run' gets it started.

            let cancel = run$1(
                factory_name,
                requestor_array,
                initial_value,
                function parallel_action(value, reason, number) {

    // The action function gets the result of each requestor in the array.
    // 'parallel' wants to return an array of all of the values it sees.

                    results[number] = value;
                    number_of_pending -= 1;

    // If the requestor was wun of the requireds, make sure it was successful.
    // If it failed, then the parallel operation fails. If an optionals requestor
    // fails, we can still continue.

                    if (number < number_of_required) {
                        number_of_pending_required -= 1;
                        if (value === undefined) {
                            cancel(reason);
                            callback(undefined, reason);
                            callback = undefined;
                            return;
                        }
                    }

    // If all have been processed, or if the requireds have all succeeded
    // and we do not have a 'time_option', then we are done.

                    if (
                        number_of_pending < 1
                        || (
                            time_option === undefined
                            && number_of_pending_required < 1
                        )
                    ) {
                        cancel(make_reason(factory_name, "Optional."));
                        callback(
                            factory_name === "sequence"
                            ? results.pop()
                            : results
                        );
                        callback = undefined;
                    }
                },
                function parallel_timeout() {

    // When the timer fires, work stops unless we were under the 'false'
    // time option. The 'false' time option puts no time limits on the
    // requireds, allowing the optionals to run until the requireds finish
    // or the time expires, whichever happens last.

                    const reason = make_reason(
                        factory_name,
                        "Timeout.",
                        time_limit
                    );
                    if (time_option === false) {
                        time_option = undefined;
                        if (number_of_pending_required < 1) {
                            cancel(reason);
                            callback(results);
                        }
                    } else {

    // Time has expired. If all of the requireds were successful,
    // then the parallel operation is successful.

                        cancel(reason);
                        if (number_of_pending_required < 1) {
                            callback(results);
                        } else {
                            callback(undefined, reason);
                        }
                        callback = undefined;
                    }
                },
                time_limit,
                throttle
            );
            return cancel;
        };
    }

    function parallel_object(
        required_object,
        optional_object,
        time_limit,
        time_option,
        throttle
    ) {

    // 'parallel_object' is similar to 'parallel' except that it takes and
    // produces objects of requestors instead of arrays of requestors. This
    // factory converts the objects to arrays, and the requestor it returns
    // turns them back again. It lets 'parallel' do most of the work.

        const names = [];
        let required_array = [];
        let optional_array = [];

    // Extract the names and requestors from 'required_object'.
    // We only collect functions with an arity of 1 or 2.

        if (required_object) {
            if (typeof required_object !== "object") {
                throw make_reason(
                    "parallel_object",
                    "Type mismatch.",
                    required_object
                );
            }
            Object.keys(required_object).forEach(function (name) {
                let requestor = required_object[name];
                if (
                    typeof requestor === "function"
                    && (requestor.length === 1 || requestor.length === 2)
                ) {
                    names.push(name);
                    required_array.push(requestor);
                }
            });
        }

    // Extract the names and requestors from 'optional_object'.
    // Look for duplicate keys.

        if (optional_object) {
            if (typeof optional_object !== "object") {
                throw make_reason(
                    "parallel_object",
                    "Type mismatch.",
                    optional_object
                );
            }
            Object.keys(optional_object).forEach(function (name) {
                let requestor = optional_object[name];
                if (
                    typeof requestor === "function"
                    && (requestor.length === 1 || requestor.length === 2)
                ) {
                    if (required_object && required_object[name] !== undefined) {
                        throw make_reason(
                            "parallel_object",
                            "Duplicate name.",
                            name
                        );
                    }
                    names.push(name);
                    optional_array.push(requestor);
                }
            });
        }

    // Make sure that we harvested something.

        if (names.length === 0) {
            return make_reason(
                "parallel_object",
                "No requestors.",
                required_object
            );
        }

    // Call parallel to get a requestor.

        const parallel_requestor = parallel(
            required_array,
            optional_array,
            time_limit,
            time_option,
            throttle,
            "parallel_object"
        );

    // Return the parallel object requestor.

        return function parallel_object_requestor(callback, initial_value) {

    // When our requestor is called, we return the result of our parallel requestor.

            return parallel_requestor(

    // We pass our callback to the parallel requestor,
    // converting its value into an object.

                function parallel_object_callback(value, reason) {
                    if (value === undefined) {
                        return callback(undefined, reason);
                    }
                    const object = Object.create(null);
                    names.forEach(function (name, index) {
                        object[name] = value[index];
                    });
                    return callback(object);
                },
                initial_value
            );
        };
    }

    function race(requestor_array, time_limit, throttle) {

    // The 'race' factory returns a requestor that starts all of the
    // requestors in 'requestor_array' at wunce. The first success wins.

        const factory_name = (
            throttle === 1
            ? "fallback"
            : "race"
        );

        check_requestor_array(requestor_array, factory_name);
        return function race_requestor(callback, initial_value) {
            check_callback(callback, factory_name);
            let number_of_pending = requestor_array.length;
            let cancel = run$1(
                factory_name,
                requestor_array,
                initial_value,
                function race_action(value, reason, number) {
                    number_of_pending -= 1;

    // We have a winner. Cancel the losers and pass the value to the 'callback'.

                    if (value !== undefined) {
                        cancel(make_reason(factory_name, "Loser.", number));
                        callback(value);
                        callback = undefined;
                    }

    // There was no winner. Signal a failure.

                    if (number_of_pending < 1) {
                        cancel(reason);
                        callback(undefined, reason);
                        callback = undefined;
                    }
                },
                function race_timeout() {
                    let reason = make_reason(
                        factory_name,
                        "Timeout.",
                        time_limit
                    );
                    cancel(reason);
                    callback(undefined, reason);
                    callback = undefined;
                },
                time_limit,
                throttle
            );
            return cancel;
        };
    }

    function fallback(requestor_array, time_limit) {

    // The 'fallback' factory returns a requestor that tries each requestor
    // in 'requestor_array', wun at a time, until it finds a successful wun.

        return race(requestor_array, time_limit, 1);
    }

    function sequence(requestor_array, time_limit) {

    // A sequence runs each requestor in order, passing results to the next,
    // as long as they are all successful. A sequence is a throttled parallel.

        return parallel(
            requestor_array,
            undefined,
            time_limit,
            undefined,
            1,
            "sequence"
        );

    }

    var parseq = Object.freeze({
        fallback,
        parallel,
        parallel_object,
        race,
        sequence
    });

    // Component name, File name
    var component_list = {
      "Brand intro": "brand_intro"
    };
    // "product_listing",
    // "product_variant_selector",
    // "menu",
    // "confirm_order_inputs",
    // "create_account",
    // "end_interaction",
    // "first_name",
    // "last_name",
    // "order_confirmation",
    // "password",
    // "shipping_address",
    // "shipping_method",
    // "sign_in_or_guest",
    // "username",
    // "verify_email",
    // "explain_experience",
    // "explain_experience_2",
    // "review_cart",
    // "apply_promo_code",
    // "select_account_mode",
    // "select_shipping_address",
    // "select_shipping_method",
    // "select_payment_method",
    // "verify_order"

    /* src\app.svelte generated by Svelte v3.12.1 */

    const file = "src\\app.svelte";

    // (241:0) {:else}
    function create_else_block(ctx) {
    	var div, t0, t1_value = ctx.$main_sequence[0] + "", t1, t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Please configure component \"");
    			t1 = text(t1_value);
    			t2 = text("\"");
    			set_style(div, "color", "red");
    			set_style(div, "padding", "1rem");
    			set_style(div, "background", "white");
    			add_location(div, file, 241, 2, 7181);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$main_sequence) && t1_value !== (t1_value = ctx.$main_sequence[0] + "")) {
    				set_data_dev(t1, t1_value);
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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(241:0) {:else}", ctx });
    	return block;
    }

    // (231:0) {#if $ComponentRef}
    function create_if_block(ctx) {
    	var t, switch_instance_anchor, current;

    	var switch_value = ctx.$ComponentRef;

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			t = text("Did you load yet?\n  ");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (switch_value !== (switch_value = ctx.$ComponentRef)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    				detach_dev(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(231:0) {#if $ComponentRef}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var current_block_type_index, if_block, if_block_anchor, current;

    	var if_block_creators = [
    		create_if_block,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.$ComponentRef) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function show_end_of_sequence(value, reason) {
      // Our program may never "ends",
      // rather it loop onto itself from Order Confirmation
      // to Continue Shopping.
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loaded_widgets, $ComponentRef, $main_sequence;

    	
      // Separate repos for Activities

      const { fallback, sequence } = parseq;
      // AST: JSON to functions Editing a program in the browser.
      const initial_sequence = [
        // "Menu",
        "Brand intro"
        // "Explain experience",
        // "Product listing",
        // "Product variant selector",
        // "Explain experience part 2",
        // "Review cart",
        // "Apply promo code",
        // "Select account mode",
        // "Select shipping address",
        // "Select shipping method",
        // "Select payment method",
        // "Verify order"
      ];
      const main_sequence = writable(initial_sequence); validate_store(main_sequence, 'main_sequence'); component_subscribe($$self, main_sequence, $$value => { $main_sequence = $$value; $$invalidate('$main_sequence', $main_sequence); });
      const loaded_widgets = writable({}); validate_store(loaded_widgets, 'loaded_widgets'); component_subscribe($$self, loaded_widgets, $$value => { $loaded_widgets = $$value; $$invalidate('$loaded_widgets', $loaded_widgets); });
      const widget_sequence = derived(
        [main_sequence, loaded_widgets],
        ({ 0: main_sequence, 1: loaded_widgets }) => {
          return main_sequence.map(widget_name => {
            if ($loaded_widgets[widget_name]) {
              return WidgetFactory(widget_name);
            } else {
              WidgetLoader(widget_name);
              
              return function(callback, value) {
                console.log("Placeholder requestor function");
              };
            }
          });
        }
      );

      // Put widget instances into Parseq
      widget_sequence.subscribe(ws => {
        sequence(ws)(show_end_of_sequence, {});
        // For example sequence(initial_sequence_array)("End");
        // sequence(ws)(() => {
        //   console.log("The top-level sequence should not end.");
        // });
      });
      const ComponentRef = writable(); validate_store(ComponentRef, 'ComponentRef'); component_subscribe($$self, ComponentRef, $$value => { $ComponentRef = $$value; $$invalidate('$ComponentRef', $ComponentRef); });

      let callback;

      function WidgetLoader(bundle_name) {
        const file_name = component_list[bundle_name];
        // For example /bundles/brand_intro.js
        return import(`/bundles/${file_name}.js`)
          .then(loaded_component => {
            // debugger;
            if (loaded_component) {
              loaded_widgets.update(obj => {
                const newObj = {};
                newObj[bundle_name] = loaded_component;
                return Object.assign({}, obj, newObj);
              });
            }
          })
          .catch(message => {
            console.log("Failed to fetch activity", message);
          });
      }

      function WidgetFactory(bundle_name) {
        console.log("WidgetFactory calls component_requestor", bundle_name);
        return function component_requestor(cb, output_from_caller) {
          // ComponentRef.set(I[name]);
          // TODO These "globals" are a bit of a problem...

          ComponentRef.set($loaded_widgets[bundle_name]);
          callback = cb;
        };
      }

      // function go_to(event) {
      //   const component_name = this.innerText;
      //   console.log(component_name);
      //   // ComponentRef.set(I[component_name]);
      //   if (loaded_widgets[bundle_name]) {
      //     ComponentRef.set(loaded_widgets[bundle_name]);
      //   } else {
      //     console.log(bundle_name, " has not loaded yet.");
      //   }
      // }

      // function x(s) {
      //   console.log("get x", s, interactions);
      //   if (typeof interactions[s] === "function") return interactions[s];
      //   // if (components[s]) return components[s];
      //   throw new Error(`Please create interaction "${s}"`);
      // }

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('callback' in $$props) callback = $$props.callback;
    		if ('$loaded_widgets' in $$props) loaded_widgets.set($loaded_widgets);
    		if ('$ComponentRef' in $$props) ComponentRef.set($ComponentRef);
    		if ('$main_sequence' in $$props) main_sequence.set($main_sequence);
    	};

    	return {
    		main_sequence,
    		loaded_widgets,
    		ComponentRef,
    		$ComponentRef,
    		$main_sequence
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment.name });
    	}
    }

    var main = new App({
      target: document.getElementById("actor")
    });

    return main;

}());
//# sourceMappingURL=app.js.map

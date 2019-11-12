# HUM
Hum is a project where the client application is the primary coordinator of interactions between the system and the human.

## Live demo
https://dynamic-sequence.netlify.com/

## Workflows

A workflow is a series of activities.

Conceptually based on parseq .

### Fallback workflow

![Fallback](https://raw.githubusercontent.com/caqu/dynamic-sequence/master/public/documentation/fallback.png)

### Sequence workflow

![Sequence](https://raw.githubusercontent.com/caqu/dynamic-sequence/master/public/documentation/sequence.png)

## Activities

Formerly known as Interaction, an Activity is made up of a prompt, input controls, custom logic, and a decision.

## Prompt
...

## Inputs
...

## Decision (callback)
The parent Activity provides a `decision` attribute with a function as value (a callback) to the child Activity.
When the child Activity completes, it invokes the decision function (like a callback) with 2 parameters.
1- Value. `undefined` to signify a failed activity or an Object of any type which is the result of the activity.
2- Reason. An optional String used when activity failed to explain why it failed.

## Concepts and practical use cases
(work in progress)
The real beauty here is the atomicity. Just as Tweets are composed into Feeds, these atomic Interactions can be:
composed at runtime into a Stream of Interactions
tracked independently, and
aggregated into a shared state.
The question of "what to show when and where" has gotten increasingly harder to manage:
- if user is "guest", show login form.
- if cart has shippable items, show shipping_address.
- if cart has an age-restricted product, show age verification.
- if customer submitted a PLCC, show shipping_method again but now containing additional options.

With today's UI patterns, this becomes the equivalent of pop-up hell. Every UI component is competing for your attention and orchestration is driven by a ton of custom code to support progress gates and custom responsive layouts with hard-coded business logic. I estimate that this complexity leads to a high-cost of development and high-risk of bugs, and limits Business' capabilities to deliver creative and comprehensive solutions.

So I'm writing a Rules Engine the manages the Interaction Stream. This way, the order of future Interactions will be based on the current state, the customer's prior inputs, and the rules given. Thus far I have that: an Interaction is made of a Prompt, Input, and Next. The Prompt can show current state, like "Hi {first_name}. What's your last name?". The customer drives the experience through Inputs. And Next runs through the rules engine to determine what to show next.

In the prototype the Interaction Stream is shown in a stand-alone page, but the format would allow you to put this inline anywhere, like in a PDP or a PLP, or in an adaptive layout that contains a progress bar, or Order Summary, when presented on a large-enough screen.

For example, setting Country, changes Prompt to State or Province.

## Constraints
In this project, we are following Douglas Crockford recommendations on The Good Part and The Better Parts and we are going to avoid using,  `new`, `this`, `Promise`, among other things. Instead this project intends to make use of functional programming concepts. If you're new to this, a promising place to start is https://www.youtube.com/watch?v=Aa_OWn03mDo

## Actor Model in practice
An Activity is based on the Actor model https://en.wikipedia.org/wiki/Actor_model
An Activity can:
- Send messages to other Activities; (passing state values?)
- Create new Activities; (put them in the sequence)
- Designate the behavior to be used for the next message it receives. (control flow:sequence)

See https://www.brianstorti.com/the-actor-model/

TODO Explore whether we need to load activities into an iframe in order to support crash recovery. In app.svelte, maybe wrap <svelte:component this={component} /> in an iFrame?

## References and inspirations
- https://www.youtube.com/watch?v=DxnYQRuLX7Q
- https://github.com/douglascrockford/parseq
- https://svelte.dev/
- Talk about rules https://www.youtube.com/watch?v=MAY4TvGUkZQ
- https://en.wikipedia.org/wiki/Control_theory
- ./README_SVELTE.md
- https://v8.dev/features/dynamic-import
- A word of caution on this approach https://blog.mgechev.com/2019/05/11/dynamic-imports-javascript/

## Questions and Answers
- Are you suggesting that every Activity has it's own server? Yeah, maybe, yeah... ?
- How do we handle relationships between activity? Through the decision, the activity gives back control to it's parent.
- How do we do input validation? It's up to each activity. Each activity can decide what is best, for example server-based validation, jQuery validate, native browser validation can all be good choices in different contexts.
- How do we know when we can sync with the server? Say I1 username, I2 password, now check with server. Handler?
- Accessibility, use Tab key to navigate? Arrow keys?
- Can we have a automatic sessionStorage?
- How do we post to API server?
- How do we do an automatic forward? See "brand intro" activity.
- Can we have a global Forward button?
- Can we have Catch(es)? See Fallback.
- Can we have a Re-Prompt?
- Can we have a Re-do button?
- Can we have a global error component?
- Can we show an alternative path?


The real beauty here is the atomicity. Just as Tweets are composed into Feeds, these atomic Interactions can be:
composed at runtime into a Stream of Interactions 
tracked independently, and
aggregated into a shared state.
The question of "what to show when and where" has gotten increasingly harder to manage:
if user is "guest", show login form.
if cart has shippable items, show shipping_address.
if cart has an age-restricted product, show age verification.
if customer submitted a PLCC, show shipping_method again but now containing additional options.

With today's UI patterns, this becomes the equivalent of pop-up hell. Every UI component is competing for your attention and orchestration is driven by a ton of custom code to support progress gates and custom responsive layouts with hard-coded business logic. I estimate that this complexity leads to a high-cost of development and high-risk of bugs, and limits Business' capabilities to deliver creative and comprehensive solutions.

So I'm writing a Rules Engine the manages the Interaction Stream. This way, the order of future Interactions will be based on the current state, the customer's prior inputs, and the rules given. Thus far I have that: an Interaction is made of a Prompt, Input, and Next. The Prompt can show current state, like "Hi {first_name}. What's your last name?". The customer drives the experience through Inputs. And Next runs through the rules engine to determine what to show next.
  
In the prototype the Interaction Stream is shown in a stand-alone page, but the format would allow you to put this inline anywhere, like in a PDP or a PLP, or in an adaptive layout that contains a progress bar, or Order Summary, when presented on a large-enough screen.

Interaction
  Prompt
  Inputs
  Next
    Set in sessionStorage
    Post to API server
    Feedback
    Connect (Automatic Forward)
    Forward button
    Re-do button. 
    Catch(es) (
      Re-Prompt, 
      Show error, 
      Show alternative path
    )
 
TODO How do we handle relationships between actions?
  For example, setting Country, changes Prompt to State or Province. 













*Psst — looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Deploying to the web

### With [now](https://zeit.co/now)

Install `now` if you haven't already:

```bash
npm install -g now
```

Then, from within your project folder:

```bash
cd public
now
```

As an alternative, use the [Now desktop client](https://zeit.co/download) and simply drag the unzipped project folder to the taskbar icon.

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public
```

<script>
  import { onDestroy, onMount } from 'svelte';
  import axios from 'axios';

    let editorContainer;
    let monaco;
    let editor;
    let model;
    let output = "Run your code to see the output!"
    let error = false;

    let processing = false;
    onMount(async () => {

        // Import our 'monaco.ts' file here
        // (onMount() will only be executed in the browser, which is what we want)
        monaco = (await import('$lib/monaco.js')).default;
  

        // Your monaco instance is ready, let's display some code!
        editor = monaco.editor.create(editorContainer, {lineNumbers: true, theme: 'vs-dark', fontFamily: 'Dark Mono'});
        model = monaco.editor.createModel(
            "console.log('Hello from Monaco! (the editor, not the city...)')",
            'javascript'
        );
        editor.setModel(model);
    });

    onDestroy(() => {
        monaco?.editor.getModels().forEach((model) => model.dispose());
        editor?.dispose();
    });


    function runCode() {
      processing = true
      axios.post('http://localhost:1000/run', {
      lang: 'java',
      code: encodeURIComponent(editor.getValue())
    }).then(res => {
        processing = false;
        output = res.data.output.replaceAll('\n', '<br>');
        console.log(res.data.output)
        error = false;
    }).catch(e => {
        processing = false;
        console.log(e.response.data)
        output = e.response.data.error + ': ' + e.response.data.message;
        error = true;
      })
  }
</script>

<div class="container">
  <div class="title">
    <h1>The Sandbox</h1>
  </div>
  <div class="instructions-container">
    <h2>Instructions</h2>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus enim neque, at lobortis dolor tristique imperdiet. Vivamus nec pellentesque diam, fringilla sagittis elit. Donec scelerisque ornare libero. Integer varius lacus ac odio lobortis, ut molestie sem tempus. Sed quis rhoncus tellus, quis fringilla purus. Cras dictum ante diam, eu aliquet nibh iaculis in. Ut fermentum sit amet felis congue efficitur.
<br>
      <br>
Donec diam nisi, molestie eget egestas non, venenatis sed tellus. Suspendisse et lorem sit amet sapien consequat vehicula. Nullam ultrices nibh non nisi semper dapibus. Nulla arcu dolor, mollis ut augue vel, lacinia placerat magna. Pellentesque augue lectus, semper vitae dapibus eu, egestas vel felis. Pellentesque ac elementum quam, in aliquet lorem. Nulla sit amet nunc a orci gravida interdum eget sed velit. Integer nibh neque, elementum in dapibus nec, scelerisque ac lectus. Maecenas eu tristique magna. Nam ligula leo, ullamcorper vitae vehicula aliquet, blandit ut enim. Proin tincidunt euismod pellentesque. Aliquam placerat lobortis leo eu aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.


  </div>
  <div class="editor-container">
    <h2>Code Editor <button class="run-btn" disabled={processing} on:click={runCode} class:processing={processing}>
      {#if processing}
        Processing <i class="bi bi-three-dots"></i>
      {:else}
        Compile and Run <i class="bi bi-play-fill"></i>
      {/if}

    </button></h2>
    <div class="editor-box">
      <div class="editor" bind:this={editorContainer} />
    </div>
  </div>
  <div class="output-container">
    <div class="tests">
      <h2>Test cases</h2>
      <div class="test-case">
        <p class="test-case-number"># 1</p>
        <p class="test-case-description">
          Input: xxx, xxx, xxx
          <br>
          Output: xyz
        </p>
      </div>
      <div class="test-case">
        <p class="test-case-number"># 2</p>
        <p class="test-case-description">
          Input: xxx, xxx, xxx
          <br>
          Output: xyz
        </p>
      </div>
      <div class="test-case">
        <p class="test-case-number"># 3</p>
        <p class="test-case-description">
          Input: xxx, xxx, xxx
          <br>
          Output: xyz
        </p>
      </div>
    </div>
    <div class="output">
      <h2>Output</h2>
      <div class="output-content" class:error={error}>
        {@html output}
      </div>
    </div>
  </div>
</div>

<style>
  button {
    /* background-color: var(--blue-5); */
    background-image: var(--gradient-9);
    background-size: cover;
    border: none;
    border-radius: var(--radius-2);
    padding: 7px;
    padding-left: 12px;
    padding-right:12px;
    font-size: 16px;
    cursor: pointer;
    float: right;
    font-family: var(--font-sans);
    font-weight: var(--font-weight-6);
    transition: 0.5s;
    box-shadow: var(--shadow-3);
  }
  .processing {
    box-shadow: none;
    background-color: var(--blue-7);
  }

  .run-btn {
    width: 175px;
  }

  button:disabled {
    cursor: default;
  }
  h2 {
    text-align: left;
    max-height: 48px;
    font-family: var(--font-sans);
  }
  .title {
    text-align: center;
    grid-row: 1;
    grid-column-start: 1;
    grid-column-end: -1;
    font-family: var(--font-sans);
    font-weight: var(--font-weight-9);
  }
  .container {
    display: grid;
    grid-template-columns: 500px auto;
    grid-template-rows: 100px calc(48px + 560px) auto;
    width: 100vw;
    height: 100vh;
  }
  .editor {
    inherits: false;
    width: 100%;
    height: 100%;
    }
  .editor-box {
    height: 500px;
    /* border: 1px solid #000; */
    /* border-radius: 10px; */
    padding: 5px;
  }

  .instructions-container {
    font-family: var(--font-sans);
    grid-column: 1;
    grid-row-start: 2;
    grid-row-end: -1;
    line-height: 2;
    overflow-y: scroll;
    padding-left: 20px;
    padding-right: 20px;
  }

  .editor-container {
    grid-column: 2;
    grid-row-start: 2;
    grid-row-end: 3;
    padding-left: 20px;
    padding-right: 20px;
    line-height: 2;
    /* overflow: hidden; */
  }

  .output-container {
    font-family: var(--font-sans);
    grid-column: 2;
    grid-row-start: 3;
    grid-row-end: -1;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: stretch;
  }
  .output {
    width: 50%;
    padding: 10px;
  }
  .tests {
    width: 50%;
    padding: 10px;
    overflow-y: scroll;
  }
  .test-case p {
    padding: 0;
    margin: 0;
  }
  .test-case {
    background-image: var(--gradient-9);
    background-size: cover;
    padding: 10px;
    border-radius: var(--radius-2);
    margin-bottom: 10px;
    color: #515151;
    z-index: 100;
    cursor: pointer;
    transition: 0.2s;
  }
  .test-case:hover {
    box-shadow: var(--shadow-3);
  }
  .test-case-number {
    font-weight: var(--font-weight-6);
  }
  .test-case-description {
    font-style: italic;
    font-size: 12px;
  }
  .output-content {
    font-family: var(--font-mono);
    font-size: 14px;
    background-color: var(--stone-5);
    border-radius: var(--radius-1);
    padding: 2px;
    padding-left: 5px;
    padding-right: 5px;
  }
  .error {
    color: red;
  }
</style>

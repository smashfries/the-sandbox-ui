import * as monaco from 'monaco-editor';

// Import the workers in a production-safe way.
// This is different than in Monaco's documentation for Vite,
// but avoids a weird error ("Unexpected usage") at runtime
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
	getWorker: function (_, label) {
		return new editorWorker();
	}
};

export default monaco;

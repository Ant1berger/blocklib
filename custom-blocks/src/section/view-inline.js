if (!window['script-loaded-' + import.meta.url.split('/').slice(-2, -1)[0]]) {
    window['script-loaded-' + import.meta.url.split('/').slice(-2, -1)[0]] = true;
    console.log( import.meta.url.split('/').slice(-2, -1)[0] + ' scripts' );
}

function addScript(JSfileName) {
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.src = JSfileName;
    document.body.appendChild(js);
}
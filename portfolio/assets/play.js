// Click-to-load itch.io embeds.
//
// The games are not loaded on page load: an itch embed pulls a whole WebGL /
// WebAssembly build, so four autoloading players would make the site unusable
// on a phone. The visitor asks for the game, then it loads.
//
// data-embed is the itch upload id, taken from each game's own itch page.
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.playbox button');
  if (!btn) return;

  var box = btn.closest('.playbox');
  var id = box.getAttribute('data-embed');
  if (!id) return;

  var frame = document.createElement('iframe');
  frame.src = 'https://itch.io/embed-upload/' + id + '?color=17160f';
  frame.setAttribute('allowfullscreen', '');
  frame.setAttribute('allow', 'autoplay; fullscreen *; gamepad; gyroscope; accelerometer; xr-spatial-tracking');
  frame.setAttribute('title', box.getAttribute('data-title') || 'Playable build');

  box.classList.add('loaded');
  box.innerHTML = '';
  box.appendChild(frame);
});

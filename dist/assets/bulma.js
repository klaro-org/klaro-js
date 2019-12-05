// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
    var burger = document.querySelector('.burger');
    if (burger) {
        var menu = document.querySelector('#' + burger.getAttribute('data-target'));
        burger.addEventListener('click', function () {
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        });
    }
})();
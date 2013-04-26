var path = require('path'),
    fs = require('fs');

var isAbsolute = function (path) {
    return ('/' === path[0]) || (':' === path[1] && '\\' === path[2]);
};

// handle 'view engine' express directive
var getPath = function (view, root, default_engine) {
    if (!isAbsolute(view)) {
        view = path.join(root, view);
    }

    var ext = path.extname(view);
    if (!ext) {
        view += (default_engine[0] !== '.' ? '.' : '') + default_engine;
    }
    return view;
};

module.exports = function(params) {
    var view_template;

    var view_template_path = getPath(
        params.view,
        params.app.locals.settings.views,
        params.app.locals.settings['view engine'] || ''
    );

    try {
        view_template = fs.readFileSync(view_template_path, 'utf-8');
    } catch (e) {
        console.error('EDT: error loading ' + params.view + ' template: ', e);
        view_template = 'Could not load template.';
    }

    return {
        name: 'template',
        template: path.join(__dirname, 'template.jade'),
        locals: {
            template_name: params.view,
            template: view_template
        }
    };
};
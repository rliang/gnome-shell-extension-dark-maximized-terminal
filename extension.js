const Meta = imports.gi.Meta;
const Gio = imports.gi.Gio;

let _settings;

function check() {
  if (global.screen.get_active_workspace().list_windows()
    .filter(w => w.wm_class === 'gnome-terminal-server')
    .filter(w => w.get_maximized() === Meta.MaximizeFlags.BOTH)
    .length)
    _settings.set_string('theme-variant', 'dark');
  else
    _settings.reset('theme-variant');
}

let _handles = [];

function enable() {
  const schema = Gio.SettingsSchemaSource.get_default()
    .lookup('org.gnome.Terminal.Legacy.Settings', false);
  if (!schema)
    return;
  _settings = new Gio.Settings({settings_schema: schema});
  _handles = ['map', 'destroy', 'size-change', 'switch-workspace']
    .map(s => global.window_manager.connect(s, global.run_at_leisure.bind(global, check)));
  check();
}

function disable() {
  if (_settings)
    _settings.reset('theme-variant');
  _handles.forEach(h => global.window_manager.disconnect(h));
}

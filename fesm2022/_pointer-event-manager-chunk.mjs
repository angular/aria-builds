var Modifier;
(function (Modifier) {
  Modifier[Modifier["None"] = 0] = "None";
  Modifier[Modifier["Ctrl"] = 1] = "Ctrl";
  Modifier[Modifier["Shift"] = 2] = "Shift";
  Modifier[Modifier["Alt"] = 4] = "Alt";
  Modifier[Modifier["Meta"] = 8] = "Meta";
  Modifier["Any"] = "Any";
})(Modifier || (Modifier = {}));
class EventManager {
  configs = [];
  handle(event) {
    for (const config of this.configs) {
      if (config.matcher(event)) {
        config.handler(event);
        if (config.preventDefault) {
          event.preventDefault();
        }
        if (config.stopPropagation) {
          event.stopPropagation();
        }
      }
    }
  }
}
function getModifiers(event) {
  return (+event.ctrlKey && Modifier.Ctrl) | (+event.shiftKey && Modifier.Shift) | (+event.altKey && Modifier.Alt) | (+event.metaKey && Modifier.Meta);
}
function hasModifiers(event, modifiers) {
  const eventModifiers = getModifiers(event);
  const modifiersList = Array.isArray(modifiers) ? modifiers : [modifiers];
  if (modifiersList.includes(Modifier.Any)) {
    return true;
  }
  return modifiersList.some(modifiers => eventModifiers === modifiers);
}

class KeyboardEventManager extends EventManager {
  options = {
    preventDefault: true,
    stopPropagation: true
  };
  on(...args) {
    const {
      modifiers,
      key,
      handler,
      options
    } = this._normalizeInputs(...args);
    this.configs.push({
      handler: handler,
      matcher: event => this._isMatch(event, key, modifiers),
      ...this.options,
      ...options
    });
    return this;
  }
  _normalizeInputs(...args) {
    const withModifiers = Array.isArray(args[0]) || args[0] in Modifier;
    const modifiers = withModifiers ? args[0] : Modifier.None;
    const key = withModifiers ? args[1] : args[0];
    const handler = withModifiers ? args[2] : args[1];
    const options = withModifiers ? args[3] : args[2];
    return {
      key: key,
      handler: handler,
      modifiers: modifiers,
      options: options ?? {}
    };
  }
  _isMatch(event, key, modifiers) {
    if (!hasModifiers(event, modifiers)) {
      return false;
    }
    if (key instanceof RegExp) {
      return key.test(event.key);
    }
    const keyStr = typeof key === 'string' ? key : key();
    return keyStr.toLowerCase() === event.key.toLowerCase();
  }
}

var MouseButton;
(function (MouseButton) {
  MouseButton[MouseButton["Main"] = 0] = "Main";
  MouseButton[MouseButton["Auxiliary"] = 1] = "Auxiliary";
  MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
})(MouseButton || (MouseButton = {}));
class PointerEventManager extends EventManager {
  options = {
    preventDefault: false,
    stopPropagation: false
  };
  on(...args) {
    const {
      button,
      handler,
      modifiers
    } = this._normalizeInputs(...args);
    this.configs.push({
      handler,
      matcher: event => this._isMatch(event, button, modifiers),
      ...this.options
    });
    return this;
  }
  _normalizeInputs(...args) {
    if (args.length === 3) {
      return {
        button: args[0],
        modifiers: args[1],
        handler: args[2]
      };
    }
    if (args.length === 2) {
      return {
        button: MouseButton.Main,
        modifiers: args[0],
        handler: args[1]
      };
    }
    return {
      button: MouseButton.Main,
      modifiers: Modifier.None,
      handler: args[0]
    };
  }
  _isMatch(event, button, modifiers) {
    return button === (event.button ?? 0) && hasModifiers(event, modifiers);
  }
}

export { KeyboardEventManager, Modifier, PointerEventManager };
//# sourceMappingURL=_pointer-event-manager-chunk.mjs.map

import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import * as i0 from '@angular/core';
import { signal, computed, Directive, inject, ElementRef, linkedSignal, input, booleanAttribute, model, afterRenderEffect } from '@angular/core';
import * as i1 from '@angular/aria/private';
import { TabListPattern, TabPattern, DeferredContentAware, TabPanelPattern, DeferredContent } from '@angular/aria/private';

function sortDirectives(a, b) {
  return (a.element().compareDocumentPosition(b.element()) & Node.DOCUMENT_POSITION_PRECEDING) > 0 ? 1 : -1;
}
class Tabs {
  _tablist = signal(undefined, ...(ngDevMode ? [{
    debugName: "_tablist"
  }] : []));
  _unorderedPanels = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_unorderedPanels"
  }] : []));
  tabs = computed(() => this._tablist()?.tabs(), ...(ngDevMode ? [{
    debugName: "tabs"
  }] : []));
  unorderedTabpanels = computed(() => [...this._unorderedPanels()].map(tabpanel => tabpanel._pattern), ...(ngDevMode ? [{
    debugName: "unorderedTabpanels"
  }] : []));
  register(child) {
    if (child instanceof TabList) {
      this._tablist.set(child);
    }
    if (child instanceof TabPanel) {
      this._unorderedPanels().add(child);
      this._unorderedPanels.set(new Set(this._unorderedPanels()));
    }
  }
  deregister(child) {
    if (child instanceof TabList) {
      this._tablist.set(undefined);
    }
    if (child instanceof TabPanel) {
      this._unorderedPanels().delete(child);
      this._unorderedPanels.set(new Set(this._unorderedPanels()));
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Tabs,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: Tabs,
    isStandalone: true,
    selector: "[ngTabs]",
    host: {
      classAttribute: "ng-tabs"
    },
    exportAs: ["ngTabs"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Tabs,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabs]',
      exportAs: 'ngTabs',
      host: {
        'class': 'ng-tabs'
      }
    }]
  }]
});
class TabList {
  _elementRef = inject(ElementRef);
  _tabs = inject(Tabs);
  _unorderedTabs = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_unorderedTabs"
  }] : []));
  _selection = linkedSignal(() => this.selectedTab() ? [this.selectedTab()] : []);
  textDirection = inject(Directionality).valueSignal;
  tabs = computed(() => [...this._unorderedTabs()].sort(sortDirectives).map(tab => tab._pattern), ...(ngDevMode ? [{
    debugName: "tabs"
  }] : []));
  orientation = input('horizontal', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  wrap = input(true, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  softDisabled = input(true, ...(ngDevMode ? [{
    debugName: "softDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  selectionMode = input('follow', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  selectedTab = model(...(ngDevMode ? [undefined, {
    debugName: "selectedTab"
  }] : []));
  _pattern = new TabListPattern({
    ...this,
    items: this.tabs,
    value: this._selection,
    activeItem: signal(undefined),
    element: () => this._elementRef.nativeElement
  });
  _hasFocused = signal(false, ...(ngDevMode ? [{
    debugName: "_hasFocused"
  }] : []));
  constructor() {
    afterRenderEffect(() => this.selectedTab.set(this._selection()[0]));
    afterRenderEffect(() => {
      if (!this._hasFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  onFocus() {
    this._hasFocused.set(true);
  }
  ngOnInit() {
    this._tabs.register(this);
  }
  ngOnDestroy() {
    this._tabs.deregister(this);
  }
  register(child) {
    this._unorderedTabs().add(child);
    this._unorderedTabs.set(new Set(this._unorderedTabs()));
  }
  deregister(child) {
    this._unorderedTabs().delete(child);
    this._unorderedTabs.set(new Set(this._unorderedTabs()));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: TabList,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: TabList,
    isStandalone: true,
    selector: "[ngTabList]",
    inputs: {
      orientation: {
        classPropertyName: "orientation",
        publicName: "orientation",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      focusMode: {
        classPropertyName: "focusMode",
        publicName: "focusMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectionMode: {
        classPropertyName: "selectionMode",
        publicName: "selectionMode",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      selectedTab: {
        classPropertyName: "selectedTab",
        publicName: "selectedTab",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      selectedTab: "selectedTabChange"
    },
    host: {
      attributes: {
        "role": "tablist"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "onFocus()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-activedescendant": "_pattern.activeDescendant()"
      },
      classAttribute: "ng-tablist"
    },
    exportAs: ["ngTabList"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: TabList,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabList]',
      exportAs: 'ngTabList',
      host: {
        'role': 'tablist',
        'class': 'ng-tablist',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-activedescendant]': '_pattern.activeDescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': 'onFocus()'
      }
    }]
  }],
  ctorParameters: () => []
});
class Tab {
  _elementRef = inject(ElementRef);
  _tabs = inject(Tabs);
  _tabList = inject(TabList);
  _id = inject(_IdGenerator).getId('ng-tab-');
  element = computed(() => this._elementRef.nativeElement, ...(ngDevMode ? [{
    debugName: "element"
  }] : []));
  tablist = computed(() => this._tabList._pattern, ...(ngDevMode ? [{
    debugName: "tablist"
  }] : []));
  tabpanel = computed(() => this._tabs.unorderedTabpanels().find(tabpanel => tabpanel.value() === this.value()), ...(ngDevMode ? [{
    debugName: "tabpanel"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  _pattern = new TabPattern({
    ...this,
    id: () => this._id,
    tablist: this.tablist,
    tabpanel: this.tabpanel,
    value: this.value
  });
  ngOnInit() {
    this._tabList.register(this);
  }
  ngOnDestroy() {
    this._tabList.deregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: Tab,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: Tab,
    isStandalone: true,
    selector: "[ngTab]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "tab"
      },
      properties: {
        "attr.data-active": "_pattern.active()",
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-selected": "_pattern.selected()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-controls": "_pattern.controls()"
      },
      classAttribute: "ng-tab"
    },
    exportAs: ["ngTab"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: Tab,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTab]',
      exportAs: 'ngTab',
      host: {
        'role': 'tab',
        'class': 'ng-tab',
        '[attr.data-active]': '_pattern.active()',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-selected]': '_pattern.selected()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-controls]': '_pattern.controls()'
      }
    }]
  }]
});
class TabPanel {
  _deferredContentAware = inject(DeferredContentAware);
  _Tabs = inject(Tabs);
  _id = inject(_IdGenerator).getId('ng-tabpanel-', true);
  tab = computed(() => this._Tabs.tabs()?.find(tab => tab.value() === this.value()), ...(ngDevMode ? [{
    debugName: "tab"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  _pattern = new TabPanelPattern({
    ...this,
    id: () => this._id,
    tab: this.tab
  });
  constructor() {
    afterRenderEffect(() => this._deferredContentAware.contentVisible.set(!this._pattern.hidden()));
  }
  ngOnInit() {
    this._Tabs.register(this);
  }
  ngOnDestroy() {
    this._Tabs.deregister(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: TabPanel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: TabPanel,
    isStandalone: true,
    selector: "[ngTabPanel]",
    inputs: {
      value: {
        classPropertyName: "value",
        publicName: "value",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "tabpanel"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.inert": "_pattern.hidden() ? true : null",
        "attr.aria-labelledby": "_pattern.labelledBy()"
      },
      classAttribute: "ng-tabpanel"
    },
    exportAs: ["ngTabPanel"],
    hostDirectives: [{
      directive: i1.DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: TabPanel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabPanel]',
      exportAs: 'ngTabPanel',
      host: {
        'role': 'tabpanel',
        'class': 'ng-tabpanel',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.inert]': '_pattern.hidden() ? true : null',
        '[attr.aria-labelledby]': '_pattern.labelledBy()'
      },
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }]
    }]
  }],
  ctorParameters: () => []
});
class TabContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: TabContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: TabContent,
    isStandalone: true,
    selector: "ng-template[ngTabContent]",
    exportAs: ["ngTabContent"],
    hostDirectives: [{
      directive: i1.DeferredContent
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: TabContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngTabContent]',
      exportAs: 'ngTabContent',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { Tab, TabContent, TabList, TabPanel, Tabs };
//# sourceMappingURL=tabs.mjs.map

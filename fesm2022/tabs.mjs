import { _IdGenerator } from '@angular/cdk/a11y';
import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, signal, computed, afterRenderEffect, Directive, input, booleanAttribute, model, linkedSignal } from '@angular/core';
import { TabListPattern, TabPattern, TabPanelPattern } from './_tabs-chunk.mjs';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.mjs';
import { Directionality } from '@angular/cdk/bidi';
import { sortDirectives } from './_element-chunk.mjs';
import './_expansion-chunk.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_list-navigation-chunk.mjs';
import './_click-event-manager-chunk.mjs';

const TABS = new InjectionToken('TABS');
const TAB_LIST = new InjectionToken('TAB_LIST');

class Tabs {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _tabList = signal(undefined, ...(ngDevMode ? [{
    debugName: "_tabList"
  }] : []));
  _tabPanels = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_tabPanels"
  }] : []));
  _tabPanelsList = computed(() => [...this._tabPanels()], ...(ngDevMode ? [{
    debugName: "_tabPanelsList"
  }] : []));
  constructor() {
    afterRenderEffect({
      write: () => {
        if (this._tabList()) {
          for (const tab of this._tabList()._sortedTabs()) {
            const panel = this._tabPanelsList().find(panel => panel === tab.panel());
            if (panel) {
              panel._tabPattern.set(tab._pattern);
            }
          }
        }
      }
    });
  }
  _registerList(list) {
    this._tabList.set(list);
  }
  _unregisterList(list) {
    this._tabList.set(undefined);
  }
  _registerPanel(panel) {
    this._tabPanels().add(panel);
    this._tabPanels.set(new Set(this._tabPanels()));
  }
  _unregisterPanel(panel) {
    this._tabPanels().delete(panel);
    this._tabPanels.set(new Set(this._tabPanels()));
  }
  findTabPanel(value) {
    return value ? this._tabPanelsList().find(panel => panel.value() === value) : undefined;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: Tabs,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.9",
    type: Tabs,
    isStandalone: true,
    selector: "[ngTabs]",
    providers: [{
      provide: TABS,
      useExisting: Tabs
    }],
    exportAs: ["ngTabs"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
  ngImport: i0,
  type: Tabs,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabs]',
      exportAs: 'ngTabs',
      providers: [{
        provide: TABS,
        useExisting: Tabs
      }]
    }]
  }],
  ctorParameters: () => []
});

class TabList {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _tabsParent = inject(TABS);
  _tabs = signal(new Set(), ...(ngDevMode ? [{
    debugName: "_tabs"
  }] : []));
  _sortedTabs = computed(() => [...this._tabs()].sort(sortDirectives), ...(ngDevMode ? [{
    debugName: "_sortedTabs"
  }] : []));
  _tabPatterns = computed(() => [...this._sortedTabs()].map(tab => tab._pattern), ...(ngDevMode ? [{
    debugName: "_tabPatterns"
  }] : []));
  orientation = input('horizontal', ...(ngDevMode ? [{
    debugName: "orientation"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  wrap = input(true, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  focusMode = input('roving', ...(ngDevMode ? [{
    debugName: "focusMode"
  }] : []));
  selectionMode = input('follow', ...(ngDevMode ? [{
    debugName: "selectionMode"
  }] : []));
  selectedTab = model(...(ngDevMode ? [undefined, {
    debugName: "selectedTab"
  }] : []));
  _selectedTabPattern = linkedSignal(() => {
    const tab = this.findTab(this.selectedTab());
    return tab?._pattern;
  }, ...(ngDevMode ? [{
    debugName: "_selectedTabPattern"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new TabListPattern({
    ...this,
    element: () => this._elementRef.nativeElement,
    activeItem: signal(undefined),
    items: this._tabPatterns,
    selectedTab: this._selectedTabPattern
  });
  constructor() {
    afterRenderEffect({
      write: () => {
        const pattern = this._selectedTabPattern();
        const tab = this._sortedTabs().find(tab => tab._pattern == pattern);
        this.selectedTab.set(tab?.value());
      }
    });
    afterRenderEffect({
      write: () => this._pattern.setDefaultStateEffect()
    });
  }
  ngOnInit() {
    this._tabsParent._registerList(this);
  }
  ngOnDestroy() {
    this._tabsParent._registerList(this);
  }
  _registerTab(child) {
    this._tabs().add(child);
    this._tabs.set(new Set(this._tabs()));
  }
  _unregisterTab(child) {
    this._tabs().delete(child);
    this._tabs.set(new Set(this._tabs()));
  }
  open(value) {
    return this._pattern.open(this.findTab(value)?._pattern);
  }
  findTab(value) {
    return value ? this._sortedTabs().find(tab => tab.value() === value) : undefined;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: TabList,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "22.0.0-next.9",
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
      selectedTab: {
        classPropertyName: "selectedTab",
        publicName: "selectedTab",
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
        "click": "_pattern.onClick($event)",
        "focusin": "_pattern.onFocusIn()"
      },
      properties: {
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-orientation": "_pattern.orientation()",
        "attr.aria-activedescendant": "_pattern.activeDescendant()"
      }
    },
    providers: [{
      provide: TAB_LIST,
      useExisting: TabList
    }],
    exportAs: ["ngTabList"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
  ngImport: i0,
  type: TabList,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabList]',
      exportAs: 'ngTabList',
      host: {
        'role': 'tablist',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-orientation]': '_pattern.orientation()',
        '[attr.aria-activedescendant]': '_pattern.activeDescendant()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(click)': '_pattern.onClick($event)',
        '(focusin)': '_pattern.onFocusIn()'
      },
      providers: [{
        provide: TAB_LIST,
        useExisting: TabList
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    orientation: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "orientation",
        required: false
      }]
    }],
    wrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }],
    softDisabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
        required: false
      }]
    }],
    focusMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "focusMode",
        required: false
      }]
    }],
    selectionMode: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selectionMode",
        required: false
      }]
    }],
    selectedTab: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "selectedTab",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["selectedTabChange"]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }]
  }
});

class Tab {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _tabsWrapper = inject(TABS);
  _tabList = inject(TAB_LIST);
  id = input(inject(_IdGenerator).getId('ng-tab-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  panel = computed(() => this._tabsWrapper.findTabPanel(this.value()), ...(ngDevMode ? [{
    debugName: "panel"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  selected = computed(() => this._pattern.selected(), ...(ngDevMode ? [{
    debugName: "selected"
  }] : []));
  _pattern = new TabPattern({
    ...this,
    element: () => this.element,
    tabList: () => this._tabList._pattern,
    tabPanel: computed(() => this.panel()?._pattern)
  });
  open() {
    this._pattern.open();
  }
  ngOnInit() {
    this._tabList._registerTab(this);
  }
  ngOnDestroy() {
    this._tabList._unregisterTab(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: Tab,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "22.0.0-next.9",
    type: Tab,
    isStandalone: true,
    selector: "[ngTab]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
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
        "attr.data-active": "active()",
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.aria-selected": "selected()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.aria-controls": "_pattern.controls()"
      }
    },
    exportAs: ["ngTab"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
  ngImport: i0,
  type: Tab,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTab]',
      exportAs: 'ngTab',
      host: {
        'role': 'tab',
        '[attr.data-active]': 'active()',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.aria-selected]': 'selected()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.aria-controls]': '_pattern.controls()'
      }
    }]
  }],
  propDecorators: {
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    value: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: true
      }]
    }]
  }
});

class TabPanel {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _deferredContentAware = inject(DeferredContentAware);
  _tabs = inject(TABS);
  id = input(inject(_IdGenerator).getId('ng-tabpanel-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  _tabPattern = signal(undefined, ...(ngDevMode ? [{
    debugName: "_tabPattern"
  }] : []));
  value = input.required(...(ngDevMode ? [{
    debugName: "value"
  }] : []));
  visible = computed(() => !this._pattern.hidden(), ...(ngDevMode ? [{
    debugName: "visible"
  }] : []));
  _pattern = new TabPanelPattern({
    ...this,
    tab: this._tabPattern
  });
  constructor() {
    afterRenderEffect({
      write: () => {
        this._deferredContentAware.contentVisible.set(this.visible());
      }
    });
  }
  ngOnInit() {
    this._tabs._registerPanel(this);
  }
  ngOnDestroy() {
    this._tabs._unregisterPanel(this);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: TabPanel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "22.0.0-next.9",
    type: TabPanel,
    isStandalone: true,
    selector: "[ngTabPanel]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
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
        "role": "tabpanel"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.tabindex": "_pattern.tabIndex()",
        "attr.inert": "!visible() ? true : null",
        "attr.aria-labelledby": "_pattern.labelledBy()"
      }
    },
    exportAs: ["ngTabPanel"],
    hostDirectives: [{
      directive: DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
  ngImport: i0,
  type: TabPanel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngTabPanel]',
      exportAs: 'ngTabPanel',
      host: {
        'role': 'tabpanel',
        '[attr.id]': '_pattern.id()',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '[attr.inert]': '!visible() ? true : null',
        '[attr.aria-labelledby]': '_pattern.labelledBy()'
      },
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    value: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: true
      }]
    }]
  }
});

class TabContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.9",
    ngImport: i0,
    type: TabContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.9",
    type: TabContent,
    isStandalone: true,
    selector: "ng-template[ngTabContent]",
    exportAs: ["ngTabContent"],
    hostDirectives: [{
      directive: DeferredContent
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.9",
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

export { Tab, TabContent, TabList, TabPanel, Tabs, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
//# sourceMappingURL=tabs.mjs.map

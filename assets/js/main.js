"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Webnn = /*#__PURE__*/function () {
  function Webnn() {
    _classCallCheck(this, Webnn);
    this.dynamicAdapt();
    this.events();
  }
  _createClass(Webnn, [{
    key: "events",
    value: function events() {
      var _this = this;
      // клик
      document.addEventListener('click', function (e) {
        _this.element = e;
        _this.target = e.target;
        // tab
        _this.tab_link = _this.target.closest('*[data-tab_link]');
        if (_this.tab_link) _this.tabs();
      });
    }
  }, {
    key: "tabs",
    value: function tabs() {
      this.element.preventDefault();
      var container = this.target.closest('.tab');
      var tab_id = this.tab_link.dataset.tab_link;

      // обработка ссылок
      var tab_links = container.querySelectorAll('*[data-tab_link]');
      tab_links.forEach(function (item) {
        item.classList.remove('tab__link--active');
        if (item.dataset.tab_link === tab_id) item.classList.add('tab__link--active');
      });

      // обработка контента
      var tab_content = container.querySelectorAll('*[data-tab_content]');
      tab_content.forEach(function (item) {
        item.classList.remove('tab__content-item--active');
        if (item.dataset.tab_content === tab_id) item.classList.add('tab__content-item--active');
      });
    }
  }, {
    key: "dynamicAdapt",
    value: function dynamicAdapt() {
      /*
      	указываем атрибут data-da в нём указываем 3 параметра
      	1 куда (в какой блок)
      	2 какой (какой посчёту в блоке для удобства можно прописать first, last)
      	3 когда ( на каком разрешении)
      	data-da="main-tab__nav, last, 991"
      */
      var originalPositions = [];
      var daElements = document.querySelectorAll('[data-da]');
      var daElementsArray = [];
      var daMatchMedia = [];
      //Заполняем массивы
      if (daElements.length > 0) {
        var number = 0;
        for (var index = 0; index < daElements.length; index++) {
          var daElement = daElements[index];
          var daMove = daElement.getAttribute('data-da');
          if (daMove != '') {
            var daArray = daMove.split(',');
            var daPlace = daArray[1] ? daArray[1].trim() : 'last';
            var daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
            var daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
            var daDestination = document.querySelector('.' + daArray[0].trim());
            if (daArray.length > 0 && daDestination) {
              daElement.setAttribute('data-da-index', number);
              //Заполняем массив первоначальных позиций
              originalPositions[number] = {
                "parent": daElement.parentNode,
                "index": indexInParent(daElement)
              };
              //Заполняем массив элементов
              daElementsArray[number] = {
                "element": daElement,
                "destination": document.querySelector('.' + daArray[0].trim()),
                "place": daPlace,
                "breakpoint": daBreakpoint,
                "type": daType
              };
              number++;
            }
          }
        }
        dynamicAdaptSort(daElementsArray);

        //Создаем события в точке брейкпоинта
        for (var _index = 0; _index < daElementsArray.length; _index++) {
          var el = daElementsArray[_index];
          var _daBreakpoint = el.breakpoint;
          var _daType = el.type;
          daMatchMedia.push(window.matchMedia("(" + _daType + "-width: " + _daBreakpoint + "px)"));
          daMatchMedia[_index].addListener(dynamicAdapt);
        }
      }
      //Основная функция
      function dynamicAdapt(e) {
        for (var _index2 = 0; _index2 < daElementsArray.length; _index2++) {
          var _el = daElementsArray[_index2];
          var _daElement = _el.element;
          var _daDestination = _el.destination;
          var _daPlace = _el.place;
          var _daBreakpoint2 = _el.breakpoint;
          var daClassname = "_dynamic_adapt_" + _daBreakpoint2;
          if (daMatchMedia[_index2].matches) {
            //Перебрасываем элементы
            if (!_daElement.classList.contains(daClassname)) {
              var actualIndex = indexOfElements(_daDestination)[_daPlace];
              if (_daPlace === 'first') {
                actualIndex = indexOfElements(_daDestination)[0];
              } else if (_daPlace === 'last') {
                actualIndex = indexOfElements(_daDestination)[indexOfElements(_daDestination).length];
              }
              _daDestination.insertBefore(_daElement, _daDestination.children[actualIndex]);
              _daElement.classList.add(daClassname);
            }
          } else {
            //Возвращаем на место
            if (_daElement.classList.contains(daClassname)) {
              dynamicAdaptBack(_daElement);
              _daElement.classList.remove(daClassname);
            }
          }
        }
        customAdapt();
      }
      //Вызов основной функции
      dynamicAdapt();

      //Функция возврата на место
      function dynamicAdaptBack(el) {
        var daIndex = el.getAttribute('data-da-index');
        var originalPlace = originalPositions[daIndex];
        var parentPlace = originalPlace['parent'];
        var indexPlace = originalPlace['index'];
        var actualIndex = indexOfElements(parentPlace, true)[indexPlace];
        parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
      }
      //Функция получения индекса внутри родителя
      function indexInParent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
      }
      //Функция получения массива индексов элементов внутри родителя
      function indexOfElements(parent, back) {
        var children = parent.children;
        var childrenArray = [];
        for (var i = 0; i < children.length; i++) {
          var childrenElement = children[i];
          if (back) {
            childrenArray.push(i);
          } else {
            //Исключая перенесенный элемент
            if (childrenElement.getAttribute('data-da') == null) {
              childrenArray.push(i);
            }
          }
        }
        return childrenArray;
      }
      //Сортировка объекта
      function dynamicAdaptSort(arr) {
        arr.sort(function (a, b) {
          if (a.breakpoint > b.breakpoint) {
            return -1;
          } else {
            return 1;
          }
        });
        arr.sort(function (a, b) {
          if (a.place > b.place) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      //Дополнительные сценарии адаптации
      function customAdapt() {
        //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }
    }
  }]);
  return Webnn;
}();
new Webnn();
document.addEventListener('click', function (e) {
  var element = e.target;

  // select
  var select = element.closest('.select');
  if (select && element.tagName !== 'INPUT') {
    select.classList.toggle('is-active');
    var label = element.closest('LABEL');
    if (label) {
      select.querySelector('.select__header').textContent = label.querySelector('SPAN').textContent;
    }
  }
  // basket-checbox
  var checkbox = e.target;
  if (checkbox.classList.contains('checkbox') && checkbox.closest('.page-basket-tab__left-selected-all')) {
    console.log(checkbox.textContent);
    var tab__left = checkbox.closest('.page-basket-tab__left');
    var checkeds = tab__left.querySelectorAll('.item-product-line input[type="checkbox"]');
    checkeds.forEach(function (item, i) {
      item.setAttribute('checked', '1');
      console.log(i);
    });
  }

  // view catalog-list
  var select_view_column = element.classList.contains('top-bar__select-view__column');
  var select_view_row = element.classList.contains('top-bar__select-view__row');
  if (select_view_column || select_view_row) {
    e.preventDefault();
    var list = document.querySelector('.page-catalog-list');
    if (select_view_row && list.classList.contains('product-list--column')) {
      list.classList.remove('product-list--column');
    }
    if (select_view_column && !list.classList.contains('product-list--column')) {
      list.classList.add('product-list--column');
    }
  }
});
//# sourceMappingURL=main.js.map

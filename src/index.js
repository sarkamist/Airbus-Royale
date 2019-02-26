//REQUIREMENTS
var _ = require('underscore');
var bsn = require('bootstrap.native/dist/bootstrap-native-v4');
var shortid = require('shortid');

var _items = {};
_items.add = function(object) {
   if (!(object instanceof Item)) {
      throw 'Object type is not valid!';
   }
   _items[shortid.generate()] = object;
};
class Item {
   constructor(name, tooltip, imgsrc, styles) {
      this.name = name;
      this.tooltip = tooltip;
      this.imgsrc = imgsrc;
      this.styles = styles;
   }
}

_items.add(new Item('MRT', 'Manual Rel. Tool', './src/images/mrt.svg', null));
_items.add(new Item('PLV', 'Passenger Life Vest', './src/images/plv.svg', null));
_items.add(new Item('ILV', 'Infant Life Vest', './src/images/ilv.svg', 'padding: 0.45rem;'));
_items.add(new Item('DEMO', 'DEMO Kit', './src/images/demo.svg', null));
_items.add(new Item('FRG', 'Fire Resistant Gloves', './src/images/frg.svg', null));
_items.add(new Item('SBE', 'Seat Belt Extension', './src/images/sbe.svg', null));
_items.add(new Item('ELT/PLB', 'Emrg. Loc. Beacon', './src/images/elt-plb.svg', null));
_items.add(new Item('CB', 'Crowbar', './src/images/cb.svg', null));
_items.add(new Item('AXE', 'Crash Axe', './src/images/axe.svg', null));
_items.add(new Item('FAK', 'First Aid Kit', './src/images/fak.svg', null));
_items.add(new Item('EMK', 'Emergency Medical Kit', './src/images/emk.svg', null));
_items.add(new Item('FL', 'Flashlight', './src/images/fl.svg', null));
_items.add(new Item('FL*', 'Flashlight*', './src/images/fl2.svg', null));
_items.add(new Item('CLV', 'Crew Life Vest', './src/images/clv.svg', null));
_items.add(new Item('SK', 'Signalling Kit', './src/images/sk.svg', null));
_items.add(new Item('O2', 'Oxygen Cylinder w/ 2 masks', './src/images/o2.svg', null));
_items.add(new Item('ISB', 'Infant Seat Belt', './src/images/isb.svg', 'padding: 0.45rem;'));
_items.add(new Item('PBE', 'Prot. Breathing Equipment', './src/images/pbe.svg', null));
_items.add(new Item('BCF', 'BCF Fire Extinguisher', './src/images/bcf.svg', null));
_items.add(new Item('MEG', 'Megaphone', './src/images/meg.svg', null));

function init() {
   //INITIALIZE TABS
   var _tabs = [];
   _.each(document.querySelectorAll('[role="tab"]'), function(element) {
      element.setAttribute('data-toggle', 'tab');
      new bsn.Tab(element);

      _.each(document.querySelectorAll('[href="#' + element.id + '"]'), function(href) {
         href.addEventListener('click', function(e) {
            e.preventDefault();
            element.Tab.show();
         });
      });
   });

   //INITIALIZE AIRBUS320
   var _airbus320 = {};
   _airbus320.tabIndex = 0;
   _airbus320.draggedItemId = null;
   _airbus320.inventory = document.getElementById('airbus320-inventory');
   _airbus320.layout = document.getElementById('airbus320-layout');
   _airbus320.validateButton = document.getElementById('airbus320-validate-button');
   _airbus320.restartButton = document.getElementById('airbus320-restart-button');

   _.each(_.shuffle(Object.keys(_items)), function(key) {
      var item = _items[key];
      if (!(item instanceof Item)) {
         return;
      }

      //ITEM CONTAINER ELEMENT
      var container = document.createElement('div');

      container.classList.add('item');

      //ITEM IMAGE ELEMENT
      var img = document.createElement('img');

      img.setAttribute('id', key);

      img.setAttribute('data-toggle', 'tooltip');
      img.setAttribute('data-placement', 'bottom');
      img.setAttribute('data-html', 'true');
      img.setAttribute('title', '<h5><span class="badge badge-light">' + item.name + '</span></h5>' + item.tooltip);
      img.setAttribute('src', item.imgsrc ? item.imgsrc : './src/images/unknown.svg');
      img.setAttribute('style', item.styles);
      img.setAttribute('draggable', 'true');

      var tooltip = new bsn.Tooltip(img);

      img.classList.add('img-fluid');
      img.classList.add('img-thumbnail');

      //IMAGE LOADER
      img.addEventListener('load', function(e) {
         img.setAttribute('tabindex', ++_airbus320.tabIndex);
         container.appendChild(img);
         _airbus320.inventory.appendChild(container);
      });
      img.addEventListener('error', function(e) {
         img.setAttribute('src', './src/images/unknown.svg');
      });

      //DRAG AND DROP
      img.addEventListener('dragstart', function(e) {
         //e.dataTransfer.setData('id', e.target.id);
         _airbus320.draggedItemId = key;
      });
      img.addEventListener('dragend', function(e) {
         tooltip.hide();
      });

      //KEYBOARD SUPPORT
      img.addEventListener('focus', function(e) {
         tooltip.show();
      });
      img.addEventListener('blur', function(e) {
         tooltip.hide();
      });

      //TOUCHSCREEN SUPPORT
      img.addEventListener('touchstart', function(e) {
         img.focus();
      });
      img.addEventListener('mouseenter', function(e) {
         img.focus();
      });
      img.addEventListener('mouseleave', function(e) {
         img.blur();
      });
   });

   _.each(_airbus320.layout.querySelectorAll('[data-toggle="slot"]'), function(element) {
      element.setAttribute('droppable', 'true');

      element.addEventListener('contextmenu', function(e) {
         e.preventDefault();
      });
      element.addEventListener('dragover', function(e) {
         e.preventDefault();
         var id = _airbus320.draggedItemId;
         var item = _items[id];
         if (item && item instanceof Item) {
            if (element.classList.contains('empty')) {
               e.dataTransfer.dropEffect = 'move';
            } else if (element.dataset.curItem === item.name) {
               e.dataTransfer.dropEffect = 'move';
            } else {
               e.dataTransfer.dropEffect = 'none';
            }
         }
      });
      element.addEventListener('drop', function(e) {
         e.preventDefault();
         var id = _airbus320.draggedItemId;
         var item = _items[id];
         if (item && item instanceof Item) {
            if (element.classList.contains('empty')) {
               element.classList.remove('empty');

               var img = document.getElementById(id).cloneNode();
               img.removeAttribute('id');
               img.removeAttribute('tabindex');

               img.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
               });
               img.addEventListener('mousedown', function(e) {
                  e.preventDefault();
                  var slot = img.parentNode;
                  switch (e.which) {
                     case 1:
										 		if (e.ctrlKey){
														slot.dataset.curQuantity = +slot.dataset.curQuantity + 5;
												 	} else {
														slot.dataset.curQuantity = +slot.dataset.curQuantity + 1;
													}
                        break;
                     case 3:
												if (e.ctrlKey) {
														slot.dataset.curQuantity = +slot.dataset.curQuantity - 5;
													} else {
														slot.dataset.curQuantity = +slot.dataset.curQuantity - 1;
													}
                        break;
                     default:
                        break;
                  }

                  var badge = slot.getElementsByClassName('badge')[0];
                  if (slot.dataset.curQuantity > 1) {
                     if (badge) {
                        badge.innerHTML = 'x' + slot.dataset.curQuantity;
                     } else {
                        badge = document.createElement('span');

                        badge.classList.add('badge');
                        badge.classList.add('badge-dark');

                        badge.innerHTML = 'x' + slot.dataset.curQuantity;

                        slot.appendChild(badge);
                     }
                  } else if (badge && slot.dataset.curQuantity == 1) {
                     slot.removeChild(badge);
                  } else if (slot.dataset.curQuantity < 1) {
                     slot.classList.add('empty');

                     slot.removeAttribute('data-cur-item');
                     slot.removeAttribute('data-cur-quantity');

                     while (slot.firstChild) {
                        slot.removeChild(slot.firstChild);
                     }
                  }
               });

               element.appendChild(img);

               element.dataset.curItem = item.name;
               element.dataset.curQuantity = 1;
            } else if (element.dataset.curItem === item.name) {
               element.dataset.curQuantity++;
            }
         }

         //CREATE BADGE
         if (element.dataset.curQuantity > 1) {
            var badge = element.getElementsByClassName('badge')[0];
            if (badge) {
               badge.innerHTML = 'x' + element.dataset.curQuantity;
            } else {
               badge = document.createElement('span');

               badge.classList.add('badge');
               badge.classList.add('badge-dark');

               badge.innerHTML = 'x' + element.dataset.curQuantity;

               element.appendChild(badge);
            }
         }

         _airbus320.draggedItemId = null;
      });
   });

   _airbus320.validateButton.addEventListener('click', function(e) {
      e.preventDefault();
      var total = 0;
      var validated = 0;
      _.each(_airbus320.layout.querySelectorAll('[data-toggle="slot"]'), function(element) {
         total += parseFloat(element.dataset.reqQuantity);
         var img = element.getElementsByTagName('img')[0];
         if (
            img &&
            element.dataset.reqItem === element.dataset.curItem &&
            element.dataset.reqQuantity === element.dataset.curQuantity
         ) {
            img.style.backgroundColor = '#28a745';
            validated += parseFloat(element.dataset.reqQuantity);
         } else if (img && element.dataset.reqItem === element.dataset.curItem) {
            img.style.backgroundColor = '#ffc107';
            validated += parseFloat(element.dataset.reqQuantity) * 0.5;
         } else if (img) {
            img.style.backgroundColor = '#dc3545';
         }
      });

      var percentage = Math.floor((validated / total) * 100);
      var progress = document.getElementById('airbus320-progress');

      progress.innerHTML = percentage + '%';
      progress.style.width = percentage + '%';

      progress.setAttribute('aria-valuenow', validated);
      progress.setAttribute('aria-valuemin', 0);
      progress.setAttribute('aria-valuemax', total);
   });

   _airbus320.restartButton.addEventListener('click', function(e) {
      e.preventDefault();
      _.each(_airbus320.layout.querySelectorAll('[data-toggle="slot"]'), function(element) {
         while (element.firstChild) {
            element.removeChild(element.firstChild);
         }
         element.classList.add('empty');
      });

      var progress = document.getElementById('airbus320-progress');

      progress.innerHTML = '';
      progress.style.width = null;

      progress.setAttribute('aria-valuenow', 0);
      progress.setAttribute('aria-valuemin', 0);
      progress.setAttribute('aria-valuemax', 0);
   });

	//INITIALIZE AIRBUS321
	var _airbus321 = {};
	_airbus321.tabIndex = 0;
	_airbus321.draggedItemId = null;
	_airbus321.inventory = document.getElementById('airbus321-inventory');
	_airbus321.layout = document.getElementById('airbus321-layout');
	_airbus321.validateButton = document.getElementById('airbus321-validate-button');
	_airbus321.restartButton = document.getElementById('airbus321-restart-button');

	_.each(_.shuffle(Object.keys(_items)), function (key) {
		var item = _items[key];
		if (!(item instanceof Item)) {
			return;
		}

		//ITEM CONTAINER ELEMENT
		var container = document.createElement('div');

		container.classList.add('item');

		//ITEM IMAGE ELEMENT
		var img = document.createElement('img');

		img.setAttribute('id', key);

		img.setAttribute('data-toggle', 'tooltip');
		img.setAttribute('data-placement', 'bottom');
		img.setAttribute('data-html', 'true');
		img.setAttribute('title', '<h5><span class="badge badge-light">' + item.name + '</span></h5>' + item.tooltip);
		img.setAttribute('src', item.imgsrc ? item.imgsrc : './src/images/unknown.svg');
		img.setAttribute('style', item.styles);
		img.setAttribute('draggable', 'true');

		var tooltip = new bsn.Tooltip(img);

		img.classList.add('img-fluid');
		img.classList.add('img-thumbnail');

		//IMAGE LOADER
		img.addEventListener('load', function (e) {
			img.setAttribute('tabindex', ++_airbus321.tabIndex);
			container.appendChild(img);
			_airbus321.inventory.appendChild(container);
		});
		img.addEventListener('error', function (e) {
			img.setAttribute('src', './src/images/unknown.svg');
		});

		//DRAG AND DROP
		img.addEventListener('dragstart', function (e) {
			//e.dataTransfer.setData('id', e.target.id);
			_airbus321.draggedItemId = key;
		});
		img.addEventListener('dragend', function (e) {
			tooltip.hide();
		});

		//KEYBOARD SUPPORT
		img.addEventListener('focus', function (e) {
			tooltip.show();
		});
		img.addEventListener('blur', function (e) {
			tooltip.hide();
		});

		//TOUCHSCREEN SUPPORT
		img.addEventListener('touchstart', function (e) {
			img.focus();
		});
		img.addEventListener('mouseenter', function (e) {
			img.focus();
		});
		img.addEventListener('mouseleave', function (e) {
			img.blur();
		});
	});

	_.each(_airbus321.layout.querySelectorAll('[data-toggle="slot"]'), function (element) {
		element.setAttribute('droppable', 'true');

		element.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		});
		element.addEventListener('dragover', function (e) {
			e.preventDefault();
			var id = _airbus321.draggedItemId;
			var item = _items[id];
			if (item && item instanceof Item) {
				if (element.classList.contains('empty')) {
					e.dataTransfer.dropEffect = 'move';
				} else if (element.dataset.curItem === item.name) {
					e.dataTransfer.dropEffect = 'move';
				} else {
					e.dataTransfer.dropEffect = 'none';
				}
			}
		});
		element.addEventListener('drop', function (e) {
			e.preventDefault();
			var id = _airbus321.draggedItemId;
			var item = _items[id];
			if (item && item instanceof Item) {
				if (element.classList.contains('empty')) {
					element.classList.remove('empty');

					var img = document.getElementById(id).cloneNode();
					img.removeAttribute('id');
					img.removeAttribute('tabindex');

					img.addEventListener('contextmenu', function (e) {
						e.preventDefault();
					});
					img.addEventListener('mousedown', function (e) {
						e.preventDefault();
						var slot = img.parentNode;
						switch (e.which) {
							case 1:
								if (e.ctrlKey) {
										slot.dataset.curQuantity = +slot.dataset.curQuantity + 5;
									} else {
										slot.dataset.curQuantity = +slot.dataset.curQuantity + 1;
									}
								break;
							case 3:
								if (e.ctrlKey) {
										slot.dataset.curQuantity = +slot.dataset.curQuantity - 5;
									} else {
										slot.dataset.curQuantity = +slot.dataset.curQuantity - 1;
									}
								break;
							default:
								break;
						}

						var badge = slot.getElementsByClassName('badge')[0];
						if (slot.dataset.curQuantity > 1) {
							if (badge) {
								badge.innerHTML = 'x' + slot.dataset.curQuantity;
							} else {
								badge = document.createElement('span');

								badge.classList.add('badge');
								badge.classList.add('badge-dark');

								badge.innerHTML = 'x' + slot.dataset.curQuantity;

								slot.appendChild(badge);
							}
						} else if (badge && slot.dataset.curQuantity == 1) {
							slot.removeChild(badge);
						} else if (slot.dataset.curQuantity < 1) {
							slot.classList.add('empty');

							slot.removeAttribute('data-cur-item');
							slot.removeAttribute('data-cur-quantity');

							while (slot.firstChild) {
								slot.removeChild(slot.firstChild);
							}
						}
					});

					element.appendChild(img);

					element.dataset.curItem = item.name;
					element.dataset.curQuantity = 1;
				} else if (element.dataset.curItem === item.name) {
					element.dataset.curQuantity++;
				}
			}

			//CREATE BADGE
			if (element.dataset.curQuantity > 1) {
				var badge = element.getElementsByClassName('badge')[0];
				if (badge) {
					badge.innerHTML = 'x' + element.dataset.curQuantity;
				} else {
					badge = document.createElement('span');

					badge.classList.add('badge');
					badge.classList.add('badge-dark');

					badge.innerHTML = 'x' + element.dataset.curQuantity;

					element.appendChild(badge);
				}
			}

			_airbus321.draggedItemId = null;
		});
	});

	_airbus321.validateButton.addEventListener('click', function (e) {
		e.preventDefault();
		var total = 0;
		var validated = 0;
		_.each(_airbus321.layout.querySelectorAll('[data-toggle="slot"]'), function (element) {
			total += parseFloat(element.dataset.reqQuantity);
			var img = element.getElementsByTagName('img')[0];
			if (
				img &&
				element.dataset.reqItem === element.dataset.curItem &&
				element.dataset.reqQuantity === element.dataset.curQuantity
			) {
				img.style.backgroundColor = '#28a745';
				validated += parseFloat(element.dataset.reqQuantity);
			} else if (img && element.dataset.reqItem === element.dataset.curItem) {
				img.style.backgroundColor = '#ffc107';
				validated += parseFloat(element.dataset.reqQuantity) * 0.5;
			} else if (img) {
				img.style.backgroundColor = '#dc3545';
			}
		});

		var percentage = Math.floor((validated / total) * 100);
		var progress = document.getElementById('airbus321-progress');

		progress.innerHTML = percentage + '%';
		progress.style.width = percentage + '%';

		progress.setAttribute('aria-valuenow', validated);
		progress.setAttribute('aria-valuemin', 0);
		progress.setAttribute('aria-valuemax', total);
	});

	_airbus321.restartButton.addEventListener('click', function (e) {
		e.preventDefault();
		_.each(_airbus321.layout.querySelectorAll('[data-toggle="slot"]'), function (element) {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
			element.classList.add('empty');
		});

		var progress = document.getElementById('airbus321-progress');

		progress.innerHTML = '';
		progress.style.width = null;

		progress.setAttribute('aria-valuenow', 0);
		progress.setAttribute('aria-valuemin', 0);
		progress.setAttribute('aria-valuemax', 0);
	});
}

if (document.readyState !== 'complete') {
   document.addEventListener('DOMContentLoaded', init());
} else {
   init();
}

/**
 * @author Aramey@163.com
 * reference:dwz.combox.js dwz.alertMsg.js
 */
(function($){
	// 局部方法 json排序
	/* Json */
	/* sort */
	Array.prototype.sortObjectWith = function (key, t, fix) {
		if (!this.length) { return this; }  		// 空数组
		t = t === 'des' ? 'des' : 'asc'; // ascending or descending sorting, 默认 升序
		fix = Object.prototype.toString.apply(fix) === '[object Function]' ? fix : function (key) { return key; };
		switch (Object.prototype.toString.apply(fix.call({}, this[0][key]))) {
			case '[object Number]':
				return this.sort(function (a, b) { return t === 'asc' ? (fix.call({}, a[key]) - fix.call({}, b[key])) : (fix.call({}, b[key]) - fix.call({}, a[key])); });
			case '[object String]':
				return this.sort(function (a, b) { return t === 'asc' ? fix.call({}, a[key]).localeCompare(fix.call({}, b[key])) : fix.call({}, b[key]).localeCompare(fix.call({}, a[key])); });
			default: return this;  // 关键字不是数字也不是字符串, 无法排序
		}
	};
	/* Json END */
	
	$.setSelect = {
		_op:{selDefTxt:"--请选择--", selBlank:"----", selLevel:-1, sortKey:"pid", sortOrder:"asc", val:"val",pid:"pid",txt:"txt",selected:""},
		/**
		 * 更新对应的combox
		 * @param {Object} combox
		 */
		reload:function(oSel){			
			var $refCombox = oSel.parents("div.combox:first");
			if($refCombox.length == 0)return;
			typeof oSel == 'string' && (oSel = $(oSel));		
			oSel.insertAfter($refCombox);
			$refCombox.remove();
			oSel.trigger("change").combox();
		},
		// 为对应的selcet填充值
		creater:function(selName, selJson, options) {
			var op = $.extend({},this._op, options);
			var selName = $(selName);
			//排序
			selJson = selJson.sortObjectWith(op.sortKey, op.sortOrder, function (id) { return parseInt(id); }); 
			this.emptySelect(selName);
			this.addOption(selName, op.selDefTxt, 0);
			for (var i = 0; i < selJson.length; i++) {
				if (selJson[i][op.pid] != -1) {
					var _pid = selJson[i][op.val];
					var _true = true;
					this.addOption(selName, selJson[i][op.txt], selJson[i][op.val]);
					if (op.selected == selJson[i][op.val].toString()) this.setOptionSel(selName, selJson[i][op.val]);
					while (_true) {
						var _blank = "";
						var _subPid = _pid;
						var _level = 0;
						for (var j = 0; j < selJson.length; j++) {
							if (selJson[j][op.pid] == _subPid) {
								_level++;
								if (op.selLevel < _level && op.selLevel > -1) break;
								_blank += op.selBlank;
								this.addOption(selName, _blank + selJson[j][op.txt], selJson[j][op.val]);
								if (op.selected == selJson[j][op.val].toString()) this.setOptionSel(selName, selJson[j][op.val]);
								_subPid = selJson[j][op.val];
								selJson[j][op.pid] = "-1";
							}
						}
						if (_subPid == _pid) _true = false;
					}
				}
			}
			this.reload(selName);
		},
		/**
		 * 获取需要填充的json值
		 * @param {Object} setSelect
		 */
		getJson:function(url,callback){
			var selJson = [{val:'1',pid:'0',txt:'1',selected:''},{val:'2',pid:'1',txt:'2',selected:'true'}];
			if($.isFunction(callback)){
				callback;
			}
			return selJson;
		},
		/**
		 * 添加选项，rel如果是true，则刷新combox，后面的同理
		 * @param {Object} dialog
		 */
		addOption:function(oSel, txt, val, rel) {
			typeof oSel == 'string' && (oSel = $(oSel));
			var index = this.getOptionIndex(oSel, val);
			//console.log(index);
			if(index > -1){
				if(alertMsg){
					alertMsg.warn("<div style='height:22px;line-height:22px;'>下拉菜单已有 <em style='font-weight:600;font-style:normal;'>" + val + "</em> 这个值!</div>");
				}else{
					alert("下拉菜单已有" + val + "这个值!");
				}
			}else{
				oSel.get(0).options.add(new Option(txt, val));
				(rel||false) && this.reload(oSel);
			}
		},
		/**
		 * 清空对应的select选项
		 * @param {Object} setSelect
		 */
		emptySelect:function(oSel) {
			typeof oSel == 'string' && (oSel = $(oSel));
			oSel.empty();
		},
		/**
		 * 通过index设置select下对应option值
		 * @param {Object} setSelect
		 */
		setOptionValue:function(oSel, txt, val, index, rel){
			typeof oSel == 'string' && (oSel = $(oSel));
			oSel.get(0).options[index].value = val;
			oSel.get(0).options[index].text = txt;
			(rel||false) && this.reload(oSel);
		},
		/**
		 * 通过index选中select下对应option值
		 * @param {Object} setSelect
		 */
		setOptionSel:function(oSel, val, rel){
			typeof oSel == 'string' && (oSel = $(oSel));
			oSel.get(0).value = val;
			(rel||false) && this.reload(oSel);
		},
		/**
		 * 通过index得到select下对应的option值
		 * @param {Object} setSelect
		 */
		getOptionValue:function(oSel, index) {
			typeof oSel == 'string' && (oSel = $(oSel));
			return oSel.get(0).value;
		},
		// 获取val对应的值
		getOptionIndex:function(oSel, val){
			typeof oSel == 'string' && (oSel = $(oSel));
			var _count = this.getSelectSize(oSel);
			var index = -1;
			for (var i = 0; i < _count; i++) {
				if (oSel.get(0).options[i].value == val) {
					index = i;
					break;
				}
			}
			return index;
		},
		// 获取当前选中项
		getSelectCurrent:function(oSel){
			typeof oSel == 'string' && (oSel = $(oSel));
			return oSel.get(0).selectedIndex;
		},
		// 获取select选项的长度
		getSelectSize:function(oSel){
			typeof oSel == 'string' && (oSel = $(oSel));
			return oSel.get(0).options.length;
		},
		// 删除select下对应的值
		removeOption:function(oSel, val, rel){
			typeof oSel == 'string' && (oSel = $(oSel));
			var _count = this.getSelectSize(oSel);
			for (var i = 0; i < _count; i++) {
				if (oSel.get(0).options[i].value == val) {
					oSel.get(0).remove(i);
					break;
				}
			}
			(rel||false) && this.reload(oSel);
		},
		// 删除select选中的值
		removeSelectedOption:function(oSel, rel){
			typeof oSel == 'string' && (oSel = $(oSel));
			this.removeIndexOption(oSel, this.getSelectCurrent(oSel));
			(rel||false) && this.reload(oSel);
		},
		// 删除对应的index值
		removeIndexOption:function(oSel, index, rel){
			typeof oSel == 'string' && (oSel = $(oSel));
			oSel.get(0).remove(index);
			(rel||false) && this.reload(oSel);
		}
	};
})(jQuery);
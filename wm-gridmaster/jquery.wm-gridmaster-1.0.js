/*!
 * jquery.wm-gridmaster - v 1.0
 * desenvolvido por Welison Menezes
 * email : welisonmenezes@gmail.com
 * 
 *
 * Copyright 2014 Welison Menezes
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */
(function($){

	var settings, callbacks;

	/**
     *  default configurations
     */
	var defaults = {
		cols : 8,
		close_button_text : 'X', // string
		next_button_text : '&gt;', // string
		prev_button_text : '&lt;', // string
		go_to_type : 'middle-thumb', // string - [none, top-thumb, middle-thumb, top-content]
		has_detail : true, // boolean
		has_navigation : true, // boolean
		navigation_position : 'middle', // string - [none, top, middle, bottom]
		thumbs_height : 'equal-width', // string or int - [equal-width, row-equal-width, int]
		spaces : {
			padding : 5, // int
			wrap : true // boolean
		},
		arrow_detail : {
			has_arrow : true, // boolean
			arrow_size : 10 // int
		},
		speeds : {
			content_down : 300, // int
			content_up : 300, // int
			go_to_opened : 200 // int
		},
		ajax : {
			has_ajax : false, // boolean
			method : 'GET', // string - [GET, POST]
			data : {}, // object js
			url : '', // string - url
			button_text : 'Add Mais', // string
			load_content : 'carregando...', // string - [text or element html]
			has_ajax_detail : false, // boolean
			method_detail : 'GET', // string - [GET, POST]
			data_detail : {}, // object js
			url_detail : '', // string - url
			load_content_detail : 'carregando...' // string - [text or element html]
		},
		selectors : { // all selector has be css class
			grid_has_opened : 'wm-grid-has-opened',
			wrap : 'wm-grid-wrap',
			item : 'wm-grid-item',
			thumbs : 'wm-grid-thumb',
			item_opened : 'wm-grid-item-opened',
			items_last_row : 'wm-grid-of-last-row',
			content : 'wm-grid-content',
			body_content : 'wm-grid-body',
			button_close : 'wm-grid-close',
			button_next : 'wm-grid-next',
			button_prev : 'wm-grid-prev',
			arrow_detail : 'wm-grid-arrow',
			ajax_button_container : 'wm-grid-action',
			ajax_button : 'wm-grid-add-more',
			ajax_load_container : 'wm-grid-loading'
		},
		callbacks : {
            CB_beforeInitGrid : false,
            CB_afterInitGrid : false,
            CB_beforeLoadAjax : false,
            CB_afterLoadAjax :  false,
            CB_beforeOpenDetail :  false,
            CB_afterOpenDetail :  false,
            CB_beforeAjaxOpenDetail :  false,
            CB_afterAjaxOpenDetail :  false,
            CB_closeDetail :  false,
            CB_nextDetail :  false,
            CB_prevDetail :  false,
            CB_goToDetail :  false
        },
		responsive : [
			{
				size : 992,
				options : {
					cols : 6, 
					spaces : {
						padding : 3,
						wrap : true
					},
					thumbs_height : 'equal-width'
				}
			},
			{
				size : 768,
				options : {
					cols : 4,
					spaces : {
						padding : 2,
						wrap : true
					},
					thumbs_height : 'equal-width'
				}
			},
			{
				size : 400,
				options : {
					cols : 2,
					spaces : {
						padding : 1,
						wrap : true
					},
					thumbs_height : 'equal-width'
				}
			}
		]
	};

	/*
	 *	retorna o numeros de colunas conforme a largura da janela
	 *  
	 *	@return int - a quantidade de colunas
	 */
	var _getCols = function()
	{
		var n_cols = settings.cols,
		w_w = $(window).width(),
		responsive = settings.responsive,
		length_reponsive = responsive.length;

		for(var i=0; i<length_reponsive; i++)
		{
			if(responsive[i].size && w_w<=responsive[i].size)
			{
				if(responsive[i].options.cols)
				{
					n_cols = responsive[i].options.cols;
				}
			}
		}

		return n_cols;
	};

	/*
	 *	retorna o espaçamento entre os thumbs conforme a largura da janela
	 *  
	 *	@return int - o espaçamento entre os thumbs
	 */
	var _getSpace = function()
	{
		var space = settings.spaces.padding,
		w_w = $(window).width(),
		responsive = settings.responsive,
		length_reponsive = responsive.length;

		for(var i=0; i<length_reponsive; i++)
		{
			if(responsive[i].size && w_w<=responsive[i].size)
			{
				if(responsive[i].options.spaces.padding)
				{
					space = responsive[i].options.spaces.padding;
				}
			}
		}

		return space;
	};

	/*
	 *	retorna a altura dos thumbs conforme a largura da janela
	 *  
	 *	@return int or string - a altura dos thumbs
	 */
	var _getHeight = function()
	{
		var height = settings.thumbs_height,
		w_w = $(window).width();

		if(height==='equal-width')
		{
			height = 'equal-width';
		}
		else if(height==='row-equal-width')
		{
			height = 'row-equal-width';
		}
		else
		{
			height = height + settings.spaces.padding;
		}

		var responsive = settings.responsive,
		length_reponsive = responsive.length;

		for(var i=0; i<length_reponsive; i++)
		{
			if(responsive[i].size && w_w<=responsive[i].size)
			{
				if(responsive[i].options.thumbs_height)
				{
					height = responsive[i].options.thumbs_height;

					if(height==='equal-width')
					{
						height = 'equal-width';
					}
					else if(height==='row-equal-width')
					{
						height = 'row-equal-width';
					}
					else
					{
						if(responsive[i].options.spaces.padding)
						{
							height = height + responsive[i].options.spaces.padding
						}
					}
				}
			}
		}

		return height;
	};

	/*
	 *	retorna se o wrap dos thumbs terá espaçamento conforme a largura da janela
	 *  
	 *	@return boolean - se o wrap terá espaçamento
	 */
	var _getSpaceWrap = function()
	{
		var s_wrap = settings.spaces.wrap,
		w_w = $(window).width(),
		responsive = settings.responsive,
		length_reponsive = responsive.length;

		for(var i=0; i<length_reponsive; i++)
		{
			if(responsive[i].size && w_w<=responsive[i].size)
			{
				if(responsive[i].options.spaces.wrap)
				{
					s_wrap = responsive[i].options.spaces.wrap;
				}
			}
		}

		return s_wrap;
	};

	/*
	 *	inicializa e cria o grid
	 *  
	 *	@param html element - o grid
	 *
	 *	@return void
	 */
	var makeGrid = function(grid)
	{
		var $grid = grid,
		$wrap = $grid.find('.'+settings.selectors.wrap)
		$itens = $wrap.find('.'+settings.selectors.item);

		var n_cols = _getCols(),
		h_item = _getHeight(),
		w_item = (100/n_cols),
		space = _getSpace(),
		s_wrap = _getSpaceWrap(),
		totalItens = $itens.length;

		if(h_item==='equal-width')
		{
			h_item = Math.floor($wrap.width()/n_cols);
		}

		if(s_wrap)
		{
			$wrap.css({
				'padding-top' : space+'px'
			});
		}
		else
		{
			$wrap.css({
				'padding-top' : '0px'
			});
		}
		
		// variaveis usadas nos loops
		var contCol = 1,
		contRow = 1,
		oldRow = 1,
		h_arr = [],
		max_h_arr = [],
		ind = 1,
		lastRow = Math.ceil($itens.length/n_cols);

		// loop pra pegar maior altura de cada linha
		if(h_item==='row-equal-width')
		{
			// variaveis usadas no loop p/ pegar maior altura
			var contCol2 = 1,
			contRow2 = 1;
			$itens.each(function(){
				var t = $(this),
				$thumbs = t.find('.'+settings.selectors.thumbs);

				t.css({
					'height' : 'auto'
				});

				$thumbs.css({
					'height' : 'auto'
				});

				h_arr.push(t.height());
				if(oldRow==contRow2 && (contCol2==n_cols))
				{
					var max_h = Math.max.apply(null, h_arr);
					max_h_arr.push(max_h);
					h_arr = [];
					oldRow++;
				}

				if(contCol2==n_cols)
				{
					contCol2=1;
					contRow2++;
				}
				else
				{
					contCol2++;
				}
			});
		}

		// seta altura e espaçamento dos itens
		$itens.each(function(){
			var t = $(this),
			$thumbs = t.find('.'+settings.selectors.thumbs),
			new_h;
			
			if(h_item==='row-equal-width' && max_h_arr[(contRow-1)])
			{
				new_h = max_h_arr[(contRow-1)];
			}
			else
			{
				new_h = h_item;
			}

			t.css({
				'width' : w_item+'%',
				'height' : new_h+'px'
			});

			$thumbs.css({
				'margin-left' : (space/2)+'px',
				'margin-right' : (space/2)+'px',
				'margin-bottom' : space+'px',
				'height' : new_h-space+'px'
			});

			// primeira coluna da linha
			if(contCol==1)
			{
				if(s_wrap)
				{
					$thumbs.css({
						'margin-left': space+'px'
					});
				}
				else
				{
					$thumbs.css({
						'margin-left': '0px'
					});
				}
			}

			// última coluna da linha
			if(contCol==n_cols)
			{
				if(s_wrap)
				{
					$thumbs.css({
						'margin-right': space+'px'
					});
				}
				else
				{
					$thumbs.css({
						'margin-right': '0px'
					});
				}
			}
			
			if(lastRow<=contRow && ! s_wrap)
			{
				$thumbs.css({
					'margin-bottom': '0px'
				});
				t.css({
					'height' : new_h-space+'px'
				});
			}

			if(lastRow<=contRow)
			{
				$thumbs.addClass(settings.selectors.items_last_row);
				t.addClass(settings.selectors.items_last_row);
			}
			else
			{
				$thumbs.removeClass(settings.selectors.items_last_row);
				t.removeClass(settings.selectors.items_last_row);
			}

			if(contCol==n_cols)
			{
				contCol=1;
				contRow++;
			}
			else
			{
				contCol++;
			}

			ind++;

			// inserir botão de fechar detalhe e a flecha no top
			if(settings.has_detail)
			{
				createCloseDetailButton(t);

				if(settings.has_navigation)
				{
					createNextDetailButton(t);
					createPrevDetailButton(t);
				}
			}

		});
	};

	/*
	 *	cria o botão pra carregar mais thumbs via ajax
	 *  
	 *	@param html element - o grid
	 *
	 *	@return void
	 */
	var createButtonAjax = function(grid)
	{
		var $grid = grid;

		if($grid.find('.'+settings.selectors.ajax_button_container).length<1)
		{
			var div = $('<div class="'+settings.selectors.ajax_button_container+'" />'),
			btn = $('<a href="'+settings.ajax.url+'" class="'+settings.selectors.ajax_button+'" title="'+settings.ajax.button_text+'">'+settings.ajax.button_text+'</a>');

			div.html(btn);

			$grid.append(div);
		}
	};

	/*
	 *	insere o load do ajax de carregamento de mais thumbs
	 *  
	 *	@param html element - o grid
	 *
	 *	@return void
	 */
	var createLoadingContent = function(grid)
	{
		var $grid = grid;

		if($grid.find('.'+settings.selectors.ajax_load_container).length<1)
		{
			var div = $('<div class="'+settings.selectors.ajax_load_container+'" />'),
			load;

			try
			{
				load = $(settings.ajax.load_content);
			}
			catch(err)
			{
				load = settings.ajax.load_content;
			}

			div.html(load);

			$grid.append(div);
		}
	};

	/*
	 *	cria o botão de fechar o detalhe e a flecha indicativa acima
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var createCloseDetailButton = function(item)
	{
		var $item = item,
		$content = $item.find('.'+settings.selectors.content),
		$close = $content.find('.'+settings.selectors.button_close),
		$arrow = $content.find('.'+settings.selectors.arrow_detail);

		if($close.length<1)
		{
			var $btn = '<span class="'+settings.selectors.button_close+'">'+settings.close_button_text+'</span>';
			$content.prepend($btn);
		}

		if(settings.arrow_detail.has_arrow && $arrow.length<1)
		{
			var $arr = '<span class="'+settings.selectors.arrow_detail+'"></span>';
			$content.prepend($arr);
		}
	};

	/*
	 *	cria o botão de next
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var createNextDetailButton = function(item)
	{
		var $item = item,
		$content = $item.find('.'+settings.selectors.content),
		$next = $content.find('.'+settings.selectors.button_next);

		if($next.length<1)
		{
			var $btn = '<span class="'+settings.selectors.button_next+'">'+settings.next_button_text+'</span>';
			$content.append($btn);
		}
	};

	/*
	 *	cria o botão de prev
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var createPrevDetailButton = function(item)
	{
		var $item = item,
		$content = $item.find('.'+settings.selectors.content),
		$prev = $content.find('.'+settings.selectors.button_prev);

		if($prev.length<1)
		{
			var $btn = '<span class="'+settings.selectors.button_prev+'">'+settings.prev_button_text+'</span>';
			$content.append($btn);
		}
	};

	/*
	 *	responde ao click do botão de carregamento ajax dos thumbs
	 *  
	 *	@return void
	 */
	var addMoreAjax = function()
	{
		$('body').on('click', '.'+settings.selectors.ajax_button, function(e){
			e.preventDefault();

			var t = $(this),
			url = (t.attr('href')) ? t.attr('href') : settings.ajax.url;

			var $w_link = t.parent(),
			$grid = $w_link.parent(),
			$wrap = $grid.find('.'+settings.selectors.wrap),
			$load = $grid.find('.'+settings.selectors.ajax_load_container);

			$w_link.hide();
			$load.show();

			callbacks.CB_beforeLoadAjax();

			$.ajax({
				method: settings.ajax.method,
				url: url,
				data: settings.ajax.data
			})
			.done(function(msg) {

				var hasItem = $(msg).filter('.'+settings.selectors.item).length;

				if(hasItem>0)
				{
					$wrap.append(msg);
					makeGrid($grid);

					windowResizeDetailPosition($grid);

					$w_link.show();
					$load.hide();
				}
				else
				{
					$w_link.hide();
					$load.hide();
				}

				callbacks.CB_afterLoadAjax();
			});
			return false;
		});
	};

	/*
	 *	abre o detalhe do thumb
	 *  
	 *	@param html element - o grid
	 *
	 *	@return void
	 */
	var openDetailGrid = function(grid)
	{
		callbacks.CB_beforeOpenDetail();

		var t = grid,
		$opened = t.parent().find('.'+settings.selectors.item+'.'+settings.selectors.item_opened),
		$box_opened = $opened.find('.'+settings.selectors.content);

		if(settings.has_detail)
		{
			t.parent().parent().parent().addClass(settings.selectors.grid_has_opened);
		}


		if($opened.length>0)
		{
			$opened.removeClass(settings.selectors.item_opened);
			$box_opened.hide();

			styledDetailGrid(t, false);
		}
		else
		{
			styledDetailGrid(t, true);
		}

		// se o conteúdo for carregado via ajax
		if(settings.ajax.has_ajax_detail)
		{
			var $body = t.find('.'+settings.selectors.body_content);
			
			var url = ($body.attr('data-ajax-url')) ? $body.attr('data-ajax-url') : settings.ajax.url_detail;

			if($.trim($body.html())=='')
			{
				callbacks.CB_beforeAjaxOpenDetail();

				$body.html(settings.ajax.load_content_detail);

				styledDetailGrid(t, false);

				$.ajax({
					method: settings.ajax.method_detail,
					url: url,
					data: settings.ajax.data_detail
				})
				.done(function(msg) {

					$body.html(msg);

					if($opened.length>0)
					{
						styledDetailGrid(t, false);
					}
					else
					{
						styledDetailGrid(t, true);
					}

					callbacks.CB_afterAjaxOpenDetail();
				});
			}
		}

		callbacks.CB_afterOpenDetail();
	};

	/*
	 *	responde ao click do thumbnail para abrir o detlahe
	 *  
	 *	@return void
	 */
	var triggerOpenDetailGrid = function()
	{
		$('body').on('click', '.'+settings.selectors.thumbs, function(e){
			e.preventDefault();

			var t = $(this).parent();

			openDetailGrid(t);

			return false;
		});
	};

	/*
	 *	responde ao click do botão de próximo detalhe
	 *
	 *	@return void
	 */
	var triggerGoToNextItem = function()
	{
		$('body').on('click', '.'+settings.selectors.button_next, function(e){
			e.preventDefault();

			var t = $(this),
			$item = t.parent().parent();

			if($item.next().length>0)
			{
				openDetailGrid($item.next());

				callbacks.CB_nextDetail();
			}

			return false;
		});
	};

	/*
	 *	responde ao click do botão de detalhe anterior
	 *
	 *	@return void
	 */
	var triggerGoToPrevItem = function()
	{
		$('body').on('click', '.'+settings.selectors.button_prev, function(e){
			e.preventDefault();

			var t = $(this),
			$item = t.parent().parent();

			if($item.prev().length>0)
			{
				openDetailGrid($item.prev());

				callbacks.CB_prevDetail();
			}

			return false;
		});
	};

	/*
	 *	abre o detalhe do item passado por parâmetro
	 *  
	 *	@param html element - o grid
	 *	@param int - o index do item desejado. (OBS: index parte do zero)
	 *
	 *	@return void
	 */
	var goToItem = function(grid, index)
	{
		var $grid = grid,
		ind = index;

		var $item = $grid.find('.'+settings.selectors.item).eq(ind);
		if($item.length>0)
		{
			openDetailGrid($item);

			callbacks.CB_goToDetail();
		}
	};

	/*
	 *	estiliza o detalhe do grid
	 *  
	 *	@param html element - o item
	 *	@param boolen - se será animado a abertura do detalhe
	 *
	 *	@return void
	 */
	var styledDetailGrid = function(item, animated)
	{
		var $item = item,
		$box = $item.find('.'+settings.selectors.content);

		positionNavigation($item);

		if(animated)
		{
			//removeMarginBottomItem($item, true);

			setMarginBottomItem($item, true);

			$box.slideDown(settings.speeds.content_down, function(){
				$item.addClass(settings.selectors.item_opened);

				setMarginBottomItem($item, true);

				positionNavigation($item);

				animatedGoToOpenedItem($item);
			});
		}
		else
		{
			//removeMarginBottomItem($item, false);

			$box.show();
			$item.addClass(settings.selectors.item_opened);

			setMarginBottomItem($item, false);

			positionNavigation($item);

			animatedGoToOpenedItem($item);
		}

		positionArrowDetail($item);
	};

	/*
	 *	seta o margin-bottom dos thumbs da mesma linha do thumb aberto
	 *  
	 *	@param html element - o item
	 *	@param boolen - se será animado o margin-bottom
	 *
	 *	@return void
	 */
	var setMarginBottomItem = function(item, animated)
	{
		var $item = item,
		$box = $item.find('.'+settings.selectors.content),
		$items = $item.parent().find('.'+settings.selectors.item);

		var item_top = $item.offset().top,
		box_h = $box.height()+_getSpace();

		$items.each(function(){
			var t = $(this),
			$t_box = t.find('.'+settings.selectors.content);

			if(t.offset().top == item_top)
			{
				if(animated)
				{
					t.stop().animate({
						'margin-bottom': box_h+'px'
					}, settings.speeds.content_down);
				}
				else
				{
					t.css({
						'margin-bottom': box_h+'px'
					});
				}
			}
			else
			{
				t.css({
					'margin-bottom': '0px'
				});
			}

			if(t.hasClass(settings.selectors.items_last_row))
			{
				if(!_getSpaceWrap())
				{
					$t_box.css({
						'margin-top' : _getSpace()+'px'
					});
				}
				else
				{
					$t_box.css({
						'margin-top' : '0px'
					});
				}
			}
			else
			{
				$t_box.css({
					'margin-top' : '0px'
				});
			}
		});
	};

	/*
	 *	remove o margin-bottom dos elementos com o margin-bottom alterado devido a visualização do detalhe
	 *  
	 *	@param html element - o item
	 *	@param boolen - se será animado a remoção do margin-bottom
	 *
	 *	@return void
	 */
	var removeMarginBottomItem = function(item, animated)
	{
		var $item = item,
		$items = $item.parent().find('.'+settings.selectors.item);

		var box_h = 0;

		$items.each(function(){
			var t = $(this);
			if(animated)
			{
				t.stop().animate({
					'margin-bottom': box_h+'px'
				}, settings.speeds.content_up);
			}
			else
			{
				t.css({
					'margin-bottom': box_h+'px'
				});
			}
		});
	};

	/*
	 *	fecha o detalhe do thumb
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var closeDetailGrid = function(item)
	{
		var $item = item,
		$box = $item.find('.'+settings.selectors.content),
		$grid = $box.parent().parent().parent().parent();

		$grid.removeClass(settings.selectors.grid_has_opened);

		$box.slideUp(settings.speeds.content_up, function(){
			$item.removeClass(settings.selectors.item_opened);
		});
		removeMarginBottomItem($item, true);

		callbacks.CB_closeDetail();
	};

	/*
	 *	responde ao click do botão de fechar o detalhe do thumb
	 *
	 *	@return void
	 */
	var triggerCloseDetailGrid = function()
	{
		$('body').on('click', '.'+settings.selectors.button_close, function(e){
			e.preventDefault();

			var t = $(this),
			$item = t.parent().parent();

			closeDetailGrid($item);

			return false;
		});
	};

	/*
	 *	atualiza posicionamento do detalhe do thumb conforme resize da janela
	 *  
	 *	@param html element - o grid
	 *
	 *	@return void
	 */
	var windowResizeDetailPosition = function(grid)
	{
		var $gird = grid,
		$item = $gird.find('.'+settings.selectors.item+'.'+settings.selectors.item_opened);

		if($item.length>0)
		{
			setMarginBottomItem($item, false);

			positionArrowDetail($item);

			positionNavigation($item);
		}
		
	};

	/*
	 *	posiciona a flecha indicativa do topo do detalhe
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var positionArrowDetail = function(item)
	{
		var $item = item,
		arrow = $item.find('.'+settings.selectors.arrow_detail),
		$grid

		arrow.css({
			'border-left-width': settings.arrow_detail.arrow_size+'px',
			'border-right-width': settings.arrow_detail.arrow_size+'px',
			'border-bottom-width': settings.arrow_detail.arrow_size+'px',
			'top' : '-'+(settings.arrow_detail.arrow_size-1)+'px'
		});

		var pos = $item.offset().left + ($item.width()/2) - _getSpace() - (settings.arrow_detail.arrow_size/2),
		pos_box = ($(window).width() - $item.parent().parent().parent().width()) / 2;

		pos = pos-pos_box;
		
		arrow.css({
			'left' : pos+'px'
		});
	};

	/*
	 *	posiciona os botões de navegação conforme configurado
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var positionNavigation = function(item)
	{
		if(! settings.has_navigation) return false;

		var $item = item,
		$content = item.find('.'+settings.selectors.content),
		$next = item.find('.'+settings.selectors.button_next),
		$prev = item.find('.'+settings.selectors.button_prev);

		if(settings.navigation_position!=='none')
		{
			$next.css({
				'position' : 'absolute',
				'top' : 'auto',
				'bottom' : '0px',
				'right' : '0px'
			});

			$prev.css({
				'position' : 'absolute',
				'top' : 'auto',
				'bottom' : '0px',
				'left' : '0px'
			});
		}
		if(settings.navigation_position==='top')
		{
			$next.css({
				'top' : '0px',
				'bottom' : 'auto'
			});

			$prev.css({
				'top' : '0px',
				'bottom' : 'auto'
			});
		}
		if(settings.navigation_position==='bottom')
		{
			$next.css({
				'top' : 'auto',
				'bottom' : '0px'
			});

			$prev.css({
				'top' : 'auto',
				'bottom' : '0px'
			});
		}
		if(settings.navigation_position==='middle')
		{
			var h_box = $content.height()/2
			h_next = h_box - $next.height()/2,
			h_prev = h_box - $prev.height()/2;

			$next.css({
				'top' : h_next+'px',
				'bottom' : 'auto'
			});

			$prev.css({
				'top' : h_prev+'px',
				'bottom' : 'auto'
			});
		}
	};

	/*
	 *	vai para o item clicado para visualização de seu detalhe
	 *  
	 *	@param html element - o item
	 *
	 *	@return void
	 */
	var animatedGoToOpenedItem = function(item)
	{
		var $item = item;

		if(settings.go_to_type==='none') return false;

		var tp = $item.offset().top;
		if(settings.go_to_type==='top-thumb')
		{
			tp = $item.offset().top;
		}
		if(settings.go_to_type==='middle-thumb')
		{
			tp = $item.offset().top + ($item.height()/2);
		}
		if(settings.go_to_type==='top-content')
		{
			tp = tp = $item.find('.'+settings.selectors.content).offset().top;
		}

		var top_pos = tp;
		if(settings.speeds.go_to_opened===0)
		{
			$('html, body').scrollTop(top_pos);
		}
		else
		{
			$('html, body').animate({
		        scrollTop: top_pos
		    }, settings.speeds.go_to_opened);
		}
	};
 
    $.fn.wmGridMaster = function(options) 
    {
    	var el = this;
    	settings = $.extend(true, defaults, options);
    	//settings = $.extend({}, defaults, options);

    	/*
    	 *	torna os callbacks executáveis
    	 */
    	callbacks = {
			CB_beforeInitGrid : function()
			{
				if($.isFunction( settings.callbacks.CB_beforeInitGrid ))
	            {
	                settings.callbacks.CB_beforeInitGrid.apply(this, arguments);
	            }
			},
			CB_afterInitGrid : function()
			{
				if($.isFunction( settings.callbacks.CB_afterInitGrid ))
	            {
	                settings.callbacks.CB_afterInitGrid.apply(this, arguments);
	            }
			},
			CB_beforeLoadAjax : function()
			{
				if($.isFunction( settings.callbacks.CB_beforeLoadAjax ))
	            {
	                settings.callbacks.CB_beforeLoadAjax.apply(this, arguments);
	            }
			},
			CB_afterLoadAjax : function()
			{
				if($.isFunction( settings.callbacks.CB_afterLoadAjax ))
	            {
	                settings.callbacks.CB_afterLoadAjax.apply(this, arguments);
	            }
			},
			CB_beforeOpenDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_beforeOpenDetail ))
	            {
	                settings.callbacks.CB_beforeOpenDetail.apply(this, arguments);
	            }
			},
			CB_afterOpenDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_afterOpenDetail ))
	            {
	                settings.callbacks.CB_afterOpenDetail.apply(this, arguments);
	            }
			},
			CB_beforeAjaxOpenDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_beforeAjaxOpenDetail ))
	            {
	                settings.callbacks.CB_beforeAjaxOpenDetail.apply(this, arguments);
	            }
			},
			CB_afterAjaxOpenDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_afterAjaxOpenDetail ))
	            {
	                settings.callbacks.CB_afterAjaxOpenDetail.apply(this, arguments);
	            }
			},
			CB_closeDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_closeDetail ))
	            {
	                settings.callbacks.CB_closeDetail.apply(this, arguments);
	            }
			},
			CB_nextDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_nextDetail ))
	            {
	                settings.callbacks.CB_nextDetail.apply(this, arguments);
	            }
			},
			CB_prevDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_prevDetail ))
	            {
	                settings.callbacks.CB_prevDetail.apply(this, arguments);
	            }
			},
			CB_goToDetail : function()
			{
				if($.isFunction( settings.callbacks.CB_goToDetail ))
	            {
	                settings.callbacks.CB_goToDetail.apply(this, arguments);
	            }
			}
		};

    	// se terá ajax load
    	if(settings.ajax.has_ajax)
    	{
    		addMoreAjax();
    	}

    	// se terá detalhe
    	if(settings.has_detail)
    	{
    		triggerOpenDetailGrid();
    		triggerGoToNextItem();
    		triggerGoToPrevItem();
    		triggerCloseDetailGrid();
    	}
 		
 		/*
		 *	inicialização via acesso externo OBRIGATÓRIO
		 *
		 *	@return void
		 */

		callbacks.CB_beforeInitGrid();

	    var init = function()
	    {
	    	el.each(function(){
		    	var t = $(this);

		        makeGrid(t);

		       	// se terá ajax load
		        if(settings.ajax.has_ajax)
		        {
		        	createButtonAjax(t);
		        	createLoadingContent(t);
		        }

		        $(window).resize(function(){
		        	makeGrid(t);
		        });

		        // se terá detalhe
		        if(settings.has_detail)
		        {
		        	windowResizeDetailPosition(el);
		        }
		    });

		    $(window).load(function(){
		    	el.fadeTo(300, 1);
		    	callbacks.CB_afterInitGrid();
		    });


		    $(window).resize(function(){
		    	// se terá detalhe
		    	if(settings.has_detail)
		        {
		        	windowResizeDetailPosition(el);
		        }
		    });
	    };

	    /*
		 *	disponibiliza o goToItem para acesso externo
		 *  
		 *	@param html element - o grid
		 *	@param int - o index do elemento desejado
		 *
		 *	@return void
		 */
	    var goTo = function(grid, index)
	    {
	    	var $grid = grid, 
	    	ind = index;

	    	goToItem($grid, ind);
	    };

	    var closeDetail = function(grid)
	    {
	    	var $grid = grid,
	    	$item = $grid.find('.'+settings.selectors.item+'.'+settings.selectors.item_opened);

	    	closeDetailGrid($item);
	    };

	    return {
	    	init : init,
	    	goTo : goTo,
	    	closeDetail : closeDetail
	    };
	 
	};
 
}(jQuery));
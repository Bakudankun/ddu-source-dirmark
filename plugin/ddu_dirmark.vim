scriptencoding utf-8

let s:save_cpo = &cpo
set cpo&vim


highlight! default link Denite_Dirmark_Name Statement


if exists('*denops#plugin#is_loaded') && denops#plugin#is_loaded('ddu')
  call ddu#custom#action('kind', 'file', 'dirmark', 'ddu_dirmark#add')
else
  augroup ddu_dirmark
    autocmd!
    autocmd User DenopsPluginPre:ddu
          \ call ddu#custom#action('kind', 'file', 'dirmark', 'ddu_dirmark#add')
  augroup END
endif


let &cpo = s:save_cpo
unlet s:save_cpo


" vim: et sw=2 sts=-1

function! ddu_dirmark#add(args) abort
  for item in a:args.items
    let path = item.action.path
    if !isdirectory(path)
      continue
    endif
    let param = {'path': path}
    let param.group = input('Adding dirmark: ' .. path .. "\n" ..
          \ 'Input group name:', dirmark#get_default_group())
    let param.name = input('Input dirmark name:', fnamemodify(path, ':t'))

    call denops#notify('ddu_dirmark', 'add', [param])
  endfor
endfunction


" vim: et sw=2 sts=-1

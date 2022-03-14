# ddu-source-dirmark

This plugin provides [denite-dirmark][1] compatible directory bookmarking
feature powered by [ddu.vim][2].

[1]: https://github.com/kmnk/denite-dirmark
[2]: https://github.com/Shougo/ddu.vim

To bookmark a directory, call `dirmark` action for an item of `file` kind. That
action is automatically defined.


## Required

* [denite-dirmark](https://github.com/kmnk/denite-dirmark)
* [denops.vim](https://github.com/vim-denops/denops.vim)
* [ddu.vim](https://github.com/Shougo/ddu.vim)
* [ddu-kind-file](https://github.com/Shougo/ddu-kind-file)

Neither python nor dentie.nvim is required.


## Configuration

```vim
" Use the source.
call ddu#start({'sources': [{'name': 'dirmark'}]})
```

See denite-dirmark's document for its configurations such as the directory to
store the data.


## License

MIT

Many part of this plugin is derived from
[Shougo/ddu-source-file_old](https://github.com/Shougo/ddu-source-file_old),
which is also licensed under the MIT license.

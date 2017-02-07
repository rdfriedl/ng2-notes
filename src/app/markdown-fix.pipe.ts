import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'myMarkdownFix'})
export class MarkdownFixPipe implements PipeTransform {
	transform(markdown: String): String {
		return markdown.replace(/\<table\>/g, '<table class="table table-hover table-bordered">');
	}
}

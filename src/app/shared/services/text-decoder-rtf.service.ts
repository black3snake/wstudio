import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextDecoderRtfService {
  async parseRtfWithTextDecoder(rtfFilePath: string, anchorId?: string): Promise<void> {
    try {
      const response = await fetch(rtfFilePath);
      const arrayBuffer = await response.arrayBuffer();

      // Пробуем разные кодировки
      const text = this.tryDecodeWithDifferentEncodings(arrayBuffer);

      const htmlContent = this.cleanRtfAndConvertToHtml(text);
      const htmlWithAnchors = this.addAnchorsToHtml(htmlContent);

      this.openHtmlInNewTab(htmlWithAnchors, anchorId);

    } catch (error) {
      console.error('Error parsing RTF:', error);
      window.open(rtfFilePath, '_blank');
    }
  }

  private tryDecodeWithDifferentEncodings(arrayBuffer: ArrayBuffer): string {
    const encodings = ['windows-1251', 'utf-8', 'iso-8859-5', 'koi8-r'];

    for (const encoding of encodings) {
      try {
        const decoder = new TextDecoder(encoding);
        const text = decoder.decode(arrayBuffer);

        // Проверяем, есть ли русский текст
        if (this.containsRussianText(text)) {
          console.log(`Successfully decoded with ${encoding}`);
          return text;
        }
      } catch (error) {
        console.warn(`Failed to decode with ${encoding}:`, error);
      }
    }

    // Fallback - используем первую кодировку
    return new TextDecoder('windows-1251').decode(arrayBuffer);
  }

  private containsRussianText(text: string): boolean {
    const russianRegex = /[А-Яа-яЁё]/;
    return russianRegex.test(text);
  }

  private cleanRtfAndConvertToHtml(text: string): string {
    // Удаляем RTF команды и теги
    let cleaned = text
      // Удаляем RTF заголовок
      .replace(/{\\rtf1[^}]*?}/g, '')
      // Удаляем команды форматирования
      .replace(/\\[a-z]+\d*/g, '')
      // Удаляем фигурные скобки
      .replace(/[{}]/g, '')
      // Заменяем параграфы
      .replace(/\\par\s*/g, '</p><p>')
      .replace(/\\line\s*/g, '<br>')
      // Убираем лишние пробелы
      .replace(/\s+/g, ' ')
      .trim();

    // Оборачиваем в параграф если нужно
    if (!cleaned.startsWith('<p>')) {
      cleaned = `<p>${cleaned}</p>`;
    }

    return cleaned;
  }

  private addAnchorsToHtml(htmlContent: string): string {
    return htmlContent
      .replace(/(ПОЛЬЗОВАТЕЛЬСКОЕ\s+СОГЛАШЕНИЕ|Пользовательское\s+соглашение)/gi,
        '<div id="agreement"><h1>$1</h1></div>')
      .replace(/(ПОЛИТИКА\s+КОНФИДЕНЦИАЛЬНОСТИ|Политика\s+конфиденциальности)/gi,
        '<div id="privacy"><h2>$1</h2></div>')
      .replace(/(СОГЛАСИЕ\s+НА\s+ОБРАБОТКУ|Согласие\s+на\s+обработку)/gi,
        '<div id="consent"><h2>$1</h2></div>');
  }

  private openHtmlInNewTab(htmlContent: string, anchorId?: string): void {
    const styledHtml = this.wrapWithEnhancedStyles(htmlContent, anchorId);
    const newWindow = window.open('', '_blank');

    if (newWindow) {
      newWindow.document.write(styledHtml);
      newWindow.document.close();

      if (anchorId) {
        setTimeout(() => {
          const element = newWindow.document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    }
  }

  private wrapWithEnhancedStyles(content: string, anchorId?: string): string {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>Пользовательское соглашение</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            margin: 40px;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            color: #333;
        }
        h1 {
            text-align: center;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            border-left: 4px solid #3498db;
            padding-left: 10px;
        }
        p {
            margin: 15px 0;
            text-align: justify;
        }
        .navigation {
            margin-bottom: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .navigation a {
            margin: 0 15px;
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .navigation a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="navigation">
        <strong>Быстрая навигация:</strong>
        <a href="#agreement">Пользовательское соглашение</a>
        <a href="#privacy">Политика конфиденциальности</a>
        <a href="#consent">Согласие на обработку данных</a>
    </div>
    ${content}
</body>
</html>`;
  }
}

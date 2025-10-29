import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HexRtfParserService {

  async parseRtfFile(rtfFilePath: string, anchorId?: string): Promise<void> {
    try {
      const response = await fetch(rtfFilePath);
      const rtfText = await response.text();

      // console.log('Original RTF start:', rtfText.substring(0, 300));

      const htmlContent = this.hexRtfToHtml(rtfText);
      const htmlWithAnchors = this.addAnchors(htmlContent);

      this.openInNewTab(htmlWithAnchors, anchorId);

    } catch (error) {
      console.error('Error parsing RTF file:', error);
      window.open(rtfFilePath, '_blank');
    }
  }

  private hexRtfToHtml(rtfText: string): string {
    let html = rtfText;

    // 1. Декодируем hex последовательности (\'cf\'ee\'eb и т.д.)
    html = this.decodeHexSequences(html);

    // console.log('After hex decoding:', html.substring(0, 300));

    // 2. Удаляем RTF заголовок и команды
    html = this.removeRtfCommands(html);

    // 3. Конвертируем в HTML
    html = this.convertToHtml(html);

    // console.log('Final HTML:', html.substring(0, 300));

    return html;
  }

  private decodeHexSequences(text: string): string {
    // Декодируем hex последовательности типа \'cf\'ee\'eb
    // Это русские буквы в Windows-1251 кодировке, представленные как hex
    return text.replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => {
      const charCode = parseInt(hex, 16);

      // Windows-1251 to Unicode mapping для русских букв
      const win1251ToUnicode: {[key: number]: string} = { 0x96: '-', 0xB9: '№',
        0xC0: 'А', 0xC1: 'Б', 0xC2: 'В', 0xC3: 'Г', 0xC4: 'Д', 0xC5: 'Е', 0xC6: 'Ж', 0xC7: 'З',
        0xC8: 'И', 0xC9: 'Й', 0xCA: 'К', 0xCB: 'Л', 0xCC: 'М', 0xCD: 'Н', 0xCE: 'О', 0xCF: 'П',
        0xD0: 'Р', 0xD1: 'С', 0xD2: 'Т', 0xD3: 'У', 0xD4: 'Ф', 0xD5: 'Х', 0xD6: 'Ц', 0xD7: 'Ч',
        0xD8: 'Ш', 0xD9: 'Щ', 0xDA: 'Ъ', 0xDB: 'Ы', 0xDC: 'Ь', 0xDD: 'Э', 0xDE: 'Ю', 0xDF: 'Я',
        0xE0: 'а', 0xE1: 'б', 0xE2: 'в', 0xE3: 'г', 0xE4: 'д', 0xE5: 'е', 0xE6: 'ж', 0xE7: 'з',
        0xE8: 'и', 0xE9: 'й', 0xEA: 'к', 0xEB: 'л', 0xEC: 'м', 0xED: 'н', 0xEE: 'о', 0xEF: 'п',
        0xF0: 'р', 0xF1: 'с', 0xF2: 'т', 0xF3: 'у', 0xF4: 'ф', 0xF5: 'х', 0xF6: 'ц', 0xF7: 'ч',
        0xF8: 'ш', 0xF9: 'щ', 0xFA: 'ъ', 0xFB: 'ы', 0xFC: 'ь', 0xFD: 'э', 0xFE: 'ю', 0xFF: 'я'
      };

      return win1251ToUnicode[charCode] || String.fromCharCode(charCode);
    });
  }

  private removeRtfCommands(text: string): string {
    // Удаляем различные RTF команды
    const commandsToKeep = [
      'par', 'line', 'tab', 'page',
      'b', 'b0', 'i', 'i0', 'ul', 'ul0'
    ];
    return text
      // Удаляем заголовок RTF
      .replace(/{\\rtf1[^}]*?}/, '')
      // Удаляем таблицу шрифтов
      .replace(/{\\fonttbl[^}]*?}/g, '')
      .replace(/{\\f\d[^}]*?}/g, '')
      // Удаляем генератор
      .replace(/{\\\*\\generator[^}]*?}/g, '')
      // Удаляем math properties
      .replace(/{\\\*\\mmathPr[^}]*?}/g, '')
      // Удаляем viewkind и другие команды
      .replace(/\\viewkind\d+\s*\\uc1\s*\\pard\s*\\nowidctlpar/g, '')
      .replace(/\\viewkind\d+\\uc1\s*\\pard\s*/g, '')
      // Удаляем оставшиеся команды форматирования
      .replace(/\\sa\d+\s*\\sl\d+\s*\\slmult1\s*\\f\d+\s*\\fs\d+/g, '')
      //// Удаляем отдельные команды
      .replace(/\\[a-z]+\d*\s*/g, (match) => {
        const commandName = match.replace(/[^a-z]/g, '');
        return commandsToKeep.includes(commandName) ? match : '';
      })
      // Удаляем фигурные скобки
      .replace(/[{}]/g, '')
      // Удаляем звездочки
      //.replace(/\\\*/g, '')

  }

  private convertToHtml(text: string): string {
    let html = text;

    // Заменяем структурные элементы
     html = html
      .replace(/\\par\s*/g, '</p><p>')
      .replace(/\\line\s*/g, '<br>')
      .replace(/\\tab\s*/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/\\page\s*/g, '<div style="page-break-after: always;"></div>')
      // Форматирование текста
      .replace(/\\b\s*/g, '<strong>')
      .replace(/\\b0\s*/g, '</strong>')
      .replace(/\\i\s*/g, '<em>')
      .replace(/\\i0\s*/g, '</em>')
      .replace(/\\ul\s*/g, '<u>')
      .replace(/\\ul0\s*/g, '</u>');

    // Очищаем лишние пробелы
    html = html
      .replace(/\s+/g, ' ')
      .replace(/\r?\n/g, '')
      .trim();

    // Оборачиваем в параграф если нужно
    if (html && !html.startsWith('<p>')) {
      html = `<p>${html}</p>`;
    }

    // Чистим HTML
    html = this.cleanHtml(html);

    return html;
  }

  private cleanHtml(html: string): string {
    return html
      .replace(/<strong><\/strong>/g, '')
      .replace(/<em><\/em>/g, '')
      .replace(/<u><\/u>/g, '')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<p>\s*<br>\s*<\/p>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private addAnchors(htmlContent: string): string {
    return htmlContent
      .replace(
        /ПОЛЬЗОВАТЕЛЬСКОЕ\s+СОГЛАШЕНИЕ/gi,
        '<span>ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</span>'
      )
      .replace(
        /СОГЛАСИЕ\s+НА\s+ОБРАБОТКУ\s+ПЕРСОНАЛЬНЫХ\s+ДАННЫХ/gi,
        '<div id="privacy"><h5>СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</h5></div>'
      )
      .replace(
        /УСЛОВИЯ\s+ПОЛЬЗОВАТЕЛЬСКОГО\s+СОГЛАШЕНИЯ/gi,
        '<div id="agreement"><h5>УСЛОВИЯ ПОЛЬЗОВАТЕЛЬСКОГО СОГЛАШЕНИЯ</h5></div>'
      )
      .replace(
        /ЧАСТЬ\s+.*\sПользователем/gi,
        '<div id="part1"><h5>ЧАСТЬ I. О ВЗАИМООТНОШЕНИЯХ АЙТИШТОРМ С ПОЛЬЗОВАТЕЛЕМ</h5></div>'
      )
      .replace(
        /1\.\s*ОБЩИЕ\s+ПОЛОЖЕНИЯ/gi,
        '<div id="general"><h5>1. ОБЩИЕ ПОЛОЖЕНИЯ</h5></div>'
      );
  }

  private openInNewTab(htmlContent: string, anchorId?: string): void {
    const styledHtml = this.wrapWithStyles(htmlContent, anchorId);
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

  private wrapWithStyles(content: string, anchorId?: string): string {
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
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            color: #333;
        }
        .navigation {
            position: sticky;
            top: 0;
            background: white;
            padding: 15px;
            border-bottom: 2px solid #007bff;
            margin-bottom: 20px;
        }
        .navigation a {
            margin: 0 10px;
            color: #007bff;
            text-decoration: none;
        }
        .navigation a:hover {
            text-decoration: underline;
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
        h3 {
            color: #2c3e50;
            margin-top: 20px;
        }
        p {
            margin: 15px 0;
            text-align: justify;
        }
    </style>
</head>
<body>
<!--    <div class="navigation">-->
<!--        <a href="#agreement">Соглашение</a>-->
<!--        <a href="#privacy">Конфиденциальность</a>-->
<!--        <a href="#consent">Согласие</a>-->
<!--        <a href="#terms">Условия</a>-->
<!--        <a href="#part1">Часть I</a>-->
<!--        <a href="#general">Общие положения</a>-->
<!--    </div>-->
    ${content}
</body>
</html>`;
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimpleRtfParserService {
  async parseRtfFile(rtfFilePath: string, anchorId?: string): Promise<void> {
    try {
      // Загружаем RTF файл
      const response = await fetch(rtfFilePath);
      const rtfText = await response.text();

      // Конвертируем RTF в HTML
      const htmlContent = this.rtfToHtml(rtfText);

      // Добавляем якоря
      const htmlWithAnchors = this.addAnchors(htmlContent);

      // Открываем в новой вкладке
      this.openInNewTab(htmlWithAnchors, anchorId);

    } catch (error) {
      console.error('Error parsing RTF file:', error);
      // Fallback: открываем файл напрямую
      window.open(rtfFilePath, '_blank');
    }
  }

  private rtfToHtml(rtfText: string): string {
    // Упрощенная конвертация RTF в HTML
    let html = rtfText;

    // Декодируем русские символы из hex формата (\'d0\'cf -> русские буквы)
    html = this.decodeHexSequences(html);

    // Удаляем RTF заголовок
    html = html.replace(/{\\rtf1[^}]*?}/, '');

    // Заменяем основные RTF команды на HTML теги
    html = html
      .replace(/\\par\s*/g, '</p><p>')
      .replace(/\\line\s*/g, '<br>')
      .replace(/\\tab\s*/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/\\b\s*/g, '<strong>')
      .replace(/\\b0\s*/g, '</strong>')
      .replace(/\\i\s*/g, '<em>')
      .replace(/\\i0\s*/g, '</em>')
      .replace(/\\ul\s*/g, '<u>')
      .replace(/\\ul0\s*/g, '</u>')
      .replace(/\\fs(\d+)\s*/g, '') // размер шрифта
      .replace(/\\f(\d+)\s*/g, '')  // шрифт
    ;

    // Удаляем оставшиеся RTF команды
    html = html.replace(/\\[a-z]+\d*\s*/g, '');

    // Удаляем фигурные скобки
    html = html.replace(/[{}]/g, '');

    // Очищаем лишние пробелы и переносы
    html = html
      .replace(/\s+/g, ' ')
      .replace(/\r?\n/g, '')
      .trim();

    // Оборачиваем в параграф
    if (html && !html.startsWith('<p>')) {
      html = `<p>${html}</p>`;
    }

    // Чистим пустые теги
    html = this.cleanHtml(html);

    return html;
  }

  private decodeHexSequences(text: string): string {
    // Декодируем hex последовательности типа \'d0\'cf
    return text.replace(/\\'([0-9a-fA-F]{2})/g, (match, hex) => {
      const charCode = parseInt(hex, 16);
      return String.fromCharCode(charCode);
    });
  }

  private addAnchors(htmlContent: string): string {
    // Добавляем якоря для навигации по разделам
    return htmlContent
      // Пользовательское соглашение
      .replace(
        /(<strong>)?\s*ПОЛЬЗОВАТЕЛЬСКОЕ\s+СОГЛАШЕНИЕ\s*(<\/strong>)?/gi,
        '<div id="agreement"><h1>ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</h1></div>'
      )
      // Политика конфиденциальности
      .replace(
        /(<strong>)?\s*ПОЛИТИКА\s+КОНФИДЕНЦИАЛЬНОСТИ\s*(<\/strong>)?/gi,
        '<div id="privacy"><h2>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h2></div>'
      )
      // Согласие на обработку данных
      .replace(
        /(<strong>)?\s*СОГЛАСИЕ\s+НА\s+ОБРАБОТКУ\s+ПЕРСОНАЛЬНЫХ\s+ДАННЫХ\s*(<\/strong>)?/gi,
        '<div id="consent"><h2>СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</h2></div>'
      )
      // Условия пользовательского соглашения
      .replace(
        /(<strong>)?\s*УСЛОВИЯ\s+ПОЛЬЗОВАТЕЛЬСКОГО\s+СОГЛАШЕНИЯ\s*(<\/strong>)?/gi,
        '<div id="terms"><h2>УСЛОВИЯ ПОЛЬЗОВАТЕЛЬСКОГО СОГЛАШЕНИЯ</h2></div>'
      )
      // Часть I
      .replace(
        /(<strong>)?\s*ЧАСТЬ\s+I\.\s*О\s+ВЗАИМООТНОШЕНИЯХ\s+АЙТИШТОРМ\s+С\s+ПОЛЬЗОВАТЕЛЕМ\s*(<\/strong>)?/gi,
        '<div id="part1"><h2>ЧАСТЬ I. О ВЗАИМООТНОШЕНИЯХ АЙТИШТОРМ С ПОЛЬЗОВАТЕЛЕМ</h2></div>'
      )
      // Общие положения
      .replace(
        /(<strong>)?\s*1\.\s*ОБЩИЕ\s+ПОЛОЖЕНИЯ\s*(<\/strong>)?/gi,
        '<div id="general"><h3>1. ОБЩИЕ ПОЛОЖЕНИЯ</h3></div>'
      );
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

  private openInNewTab(htmlContent: string, anchorId?: string): void {
    const styledHtml = this.wrapWithStyles(htmlContent, anchorId);
    const newWindow = window.open('', '_blank');

    if (newWindow) {
      newWindow.document.write(styledHtml);
      newWindow.document.close();

      // Прокручиваем к нужному разделу
      if (anchorId) {
        setTimeout(() => {
          const element = newWindow.document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Подсвечиваем раздел
            this.highlightElement(element);
          }
        }, 200);
      }
    }
  }

  private highlightElement(element: HTMLElement): void {
    const originalBackground = element.style.backgroundColor;
    const originalBorder = element.style.borderLeft;

    element.style.backgroundColor = '#fffacd';
    element.style.borderLeft = '4px solid #ffeb3b';
    element.style.transition = 'all 0.5s ease';
    element.style.paddingLeft = '10px';
    element.style.marginLeft = '-10px';

    setTimeout(() => {
      element.style.backgroundColor = originalBackground;
      element.style.borderLeft = originalBorder;
      element.style.paddingLeft = '';
      element.style.marginLeft = '';
    }, 3000);
  }

  private wrapWithStyles(content: string, anchorId?: string): string {
    const sectionTitle = this.getSectionTitle(anchorId);

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>${sectionTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            padding: 20px;
        }

        .document-container {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 25mm;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            border-radius: 4px;
        }

        .navigation {
            position: sticky;
            top: 0;
            background: white;
            padding: 15px;
            border-bottom: 2px solid #007bff;
            z-index: 100;
            margin-bottom: 20px;
            border-radius: 4px;
        }

        .navigation a {
            margin: 0 12px;
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
        }

        .navigation a:hover {
            text-decoration: underline;
        }

        h1 {
            font-size: 20pt;
            text-align: center;
            margin: 25px 0 15px 0;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 12px;
        }

        h2 {
            font-size: 16pt;
            margin: 30px 0 15px 0;
            color: #34495e;
            border-left: 4px solid #3498db;
            padding-left: 12px;
        }

        h3 {
            font-size: 14pt;
            margin: 20px 0 12px 0;
            color: #2c3e50;
            padding-left: 8px;
        }

        p {
            margin: 12px 0;
            text-align: justify;
            font-size: 12pt;
            text-indent: 1.5em;
        }

        strong {
            font-weight: bold;
        }

        em {
            font-style: italic;
        }

        u {
            text-decoration: underline;
        }

        .highlighted {
            background-color: #fffacd !important;
            border-left: 4px solid #ffeb3b !important;
            padding-left: 12px !important;
            margin-left: -12px !important;
            transition: all 0.5s ease;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .document-container {
                box-shadow: none;
                margin: 0;
                padding: 15mm;
            }

            .navigation {
                display: none;
            }
        }

        /* Нумерация пунктов */
        /*p:contains("1."), p:contains("2."), p:contains("3.") {*/
        /*    margin-left: 20px;*/
        /*}*/
    </style>
</head>
<body>
    <div class="document-container">
        <div class="navigation">
            <strong>Навигация:</strong>
            <a href="#agreement">Соглашение</a>
            <a href="#privacy">Конфиденциальность</a>
            <a href="#consent">Согласие на обработку</a>
            <a href="#terms">Условия</a>
            <a href="#part1">Часть I</a>
            <a href="#general">Общие положения</a>
        </div>
        ${content}
    </div>

    <script>
        // Авто-скролл к целевому разделу
        const targetAnchor = '${anchorId}';
        if (targetAnchor) {
            setTimeout(() => {
                const element = document.getElementById(targetAnchor);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    element.classList.add('highlighted');

                    setTimeout(() => {
                        element.classList.remove('highlighted');
                    }, 3000);
                }
            }, 300);
        }

        // Обработка печати
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                setTimeout(() => window.print(), 100);
            }
        });

        // Улучшенная навигация
        document.querySelectorAll('.navigation a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>
</body>
</html>`;
  }

  private getSectionTitle(anchorId?: string): string {
    const titles: {[key: string]: string} = {
      'agreement': 'Пользовательское соглашение',
      'privacy': 'Политика конфиденциальности',
      'consent': 'Согласие на обработку данных',
      'terms': 'Условия соглашения',
      'part1': 'Часть I - Взаимоотношения',
      'general': 'Общие положения'
    };
    return anchorId ? titles[anchorId] || 'Документ' : 'Пользовательское соглашение';
  }
}

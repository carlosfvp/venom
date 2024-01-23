import { load } from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { Buffer } from 'buffer';

export async function readResponseFromUrl(url: string): Promise<string> {
  try {
    const response: AxiosResponse<string> = await axios(url);
    const htmlContent: string = response.data;
    return htmlContent;
  } catch (e) {
    console.log(`Error getting response ${url}`, e);
    return '';
  }
}

export async function readMetaFromResponse(
  htmlContent: string,
  tag: string
): Promise<string> {
  try {
    const $ = load(htmlContent);
    let value = '';

    $(`meta[property="${tag}"]`).each((index, element) => {
      value = $(element).attr('content');
    });

    return value;
  } catch (e) {
    console.log(`Error meta tag ${tag}`, e);
    return '';
  }
}

export async function dowloadMetaFileBase64(url: string): Promise<string> {
  const backImage =
    'iVBORw0KGgoAAAANSUhEUgAAAGMAAABjCAIAAAAAWSnCAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVHhe7cExAQAAAMKg9U9tCj8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADipAXM+AAFcstx4AAAAAElFTkSuQmCC';
  try {
    const response: AxiosResponse<string> = await axios(url);
    const htmlContent: string = response.data;
    const $ = load(htmlContent);
    let thumbnail = '';

    $('link[type="image/png"]').each((index, element) => {
      const imgURL = $(element).attr('href');
      if (imgURL) {
        if (!imgURL.includes('http')) {
          thumbnail = url + imgURL;
        } else {
          thumbnail = imgURL;
        }
        return false;
      }
    });

    $('meta[property="og:image"]').each((index, element) => {
      const imgURL = $(element).attr('content');
      if (imgURL) {
        if (!imgURL.includes('http')) {
          thumbnail = url + imgURL;
        } else {
          thumbnail = imgURL;
        }
        return false;
      }
    });

    $('meta[itemprop="image"]').each((index, element) => {
      const imgURL = $(element).attr('content');
      if (imgURL) {
        if (!imgURL.includes('http')) {
          thumbnail = url + imgURL;
        } else {
          thumbnail = imgURL;
        }
        return false;
      }
    });

    if (!thumbnail) {
      $('meta[name="twitter:image"]').each((index, element) => {
        const imgURL = $(element).attr('content');
        if (imgURL) {
          if (!imgURL.includes('http')) {
            thumbnail = url + imgURL;
          } else {
            thumbnail = imgURL;
          }
          return false;
        }
      });
    }

    if (thumbnail) {
      const imageResponse: AxiosResponse<ArrayBuffer> = await axios(thumbnail, {
        responseType: 'arraybuffer'
      });
      const base64Thumbnail = Buffer.from(imageResponse.data).toString(
        'base64'
      );

      return base64Thumbnail;
    }
    return backImage;
  } catch (e) {
    console.log('Erro meta thumbnail', e);
    return backImage;
  }
}

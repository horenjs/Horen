/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-02-01 15:54:18
 * @LastEditTime : 2022-02-01 15:54:19
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\utils\request.util.ts
 * @Description  :
 */
import {default as req} from 'request';

export async function post(url: string, data: any) {
  return new Promise((resolve, reject) => {
    req.post(
      {
        url: url,
        form: data,
      },
      (err: any, res: any, body: any) => {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) resolve(body);
          else reject(res);
        }
      }
    );
  });
}

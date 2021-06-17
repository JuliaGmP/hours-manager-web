/**
 *
 * @param {*} url to fetch
 * @param {*} method GET/POST/PUT/...
 * @param  bodyReq request body
 * @param  params  url params
 * @param  token authorizathion token
 * @returns  response json
 * @author Adriller Ferreira
 */

export default async function customFetch(url, method = "GET", bodyReq = null, params = null, token = null) {
    if (!url) return { error: "invalid url" };
    // const finalUrl = token ? url + `?access_token=${token}` : url;
    const finalUrl = params ? url + "/" + params : url;
    //console.log('url', finalUrl)
    let response;
    response = await fetch(finalUrl, {
        method,
        // params:  params ? JSON.stringify(params) : null,
        body: bodyReq ? JSON.stringify(bodyReq) : null,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        }
    });
    let jsonResponse = response;
    if (response.headers && response.headers.get("Content-Type")) {
        if (response.headers.get("Content-Type").indexOf("application/json") > -1) {
            try {
                jsonResponse = await response.json();
            } catch (err) {
                jsonResponse = response;
            }
        }
    }
    return jsonResponse;
}

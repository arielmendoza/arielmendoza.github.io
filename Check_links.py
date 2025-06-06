import requests
import re
import glob
from bs4 import BeautifulSoup

# Expresiones para enlaces cortos y largos de Amazon
patron_amzn = r'href="(https://amzn\.to/[^\"]+)"'
patron_amazon = r'href="(https://www\.amazon\.[^\"]+)"|href="(https://amazon\.[^\"]+)"'

# Diccionario: {enlace: [lista de archivos donde aparece]}
enlaces = {}

# Extraer todos los enlaces de Amazon y su archivo de origen
for filename in glob.glob("*.html"):
    with open(filename, encoding="utf-8", errors="ignore") as f:
        contenido = f.read()
        encontrados = re.findall(patron_amzn, contenido)
        encontrados += [x for x in re.findall(patron_amazon, contenido) if x[0] or x[1]]
        for url in encontrados:
            # url puede ser una tupla si es del segundo patrón
            if isinstance(url, tuple):
                url = url[0] if url[0] else url[1]
            if url not in enlaces:
                enlaces[url] = []
            enlaces[url].append(filename)

print(f"Total enlaces únicos encontrados: {len(enlaces)}\n")

# Comprobar cada enlace
resultados = []
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
for url, archivos in enlaces.items():
    try:
        # Si es amzn.to, seguir redirección
        if "amzn.to" in url:
            resp = requests.head(url, allow_redirects=True, timeout=10, headers=headers)
            final_url = resp.url
            status = resp.status_code
        else:
            final_url = url
            resp = requests.head(final_url, allow_redirects=True, timeout=10, headers=headers)
            status = resp.status_code

        # Si es correcto, obtener el título real del producto
        titulo = ""
        if status == 200 and "amazon." in final_url and "error" not in final_url:
            # Descargar la página y extraer el <title>
            try:
                page = requests.get(final_url, timeout=10, headers=headers)
                soup = BeautifulSoup(page.text, "html.parser")
                titulo = soup.title.string.strip() if soup.title else ""
            except Exception as e:
                titulo = f"ERROR obteniendo título: {e}"
            estado = "CORRECTO"
        else:
            estado = f"ROTO (HTTP {status})"
        resultados.append({
            "url": url,
            "archivos": archivos,
            "estado": estado,
            "destino": final_url,
            "titulo": titulo
        })
    except Exception as e:
        resultados.append({
            "url": url,
            "archivos": archivos,
            "estado": f"ERROR ({e})",
            "destino": "",
            "titulo": ""
        })

# Mostrar resultados
print("=== RESULTADOS ===\n")
for r in resultados:
    print(f"{r['estado']}: {r['url']}")
    print(f"  Archivos: {', '.join(r['archivos'])}")
    print(f"  Destino: {r['destino']}")
    print(f"  Título: {r['titulo']}\n")
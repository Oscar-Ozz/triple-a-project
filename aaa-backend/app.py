import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from config import get_connection

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# --- CONFIGURACIÓN DE IMÁGENES --- #
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- Ruta para meter las imágenes al frontend
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# --- RUTA DE OBTENCIÓN (GET) CON FILTROS Y BÚSQUEDA ---

@app.route('/luchadores', methods=['GET'])
def obtener_luchadores():
    try:
        buscar = request.args.get('buscar', '')
        categoria = request.args.get('categoria', '')

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM luchadores WHERE nombre LIKE %s"
        params = [f"%{buscar}%"]

        if categoria and categoria != 'Todos':
            if categoria in ['TÉCNICO', 'RUDO']:
                query += " AND bando = %s"
            else:
                query += " AND categoria = %s"
            params.append(categoria)

        cursor.execute(query, tuple(params))
        res = cursor.fetchall()
        conn.close()
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/tienda', methods=['GET'])
def obtener_productos():
    try:
        buscar = request.args.get('buscar', '')
        categoria = request.args.get('categoria', '')

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM tienda WHERE producto LIKE %s"
        params = [f"%{buscar}%"]

        if categoria and categoria != 'Todos':
            query += " AND categoria = %s"
            params.append(categoria)

        cursor.execute(query, tuple(params))
        res = cursor.fetchall()
        conn.close()
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- RUTAS DINÁMICAS (PUT) CORREGIDAS PARA EDITAR SIN BORRAR IMAGEN ---

@app.route('/luchadores/<int:id_item>', methods=['PUT'])
@app.route('/tienda/<int:id_item>', methods=['PUT'])
def actualizar_item(id_item):
    try:
        tipo = 'luchadores' if 'luchadores' in request.path else 'tienda'
        categoria = request.form.get('categoria')
        
        file = request.files.get('imagen')
        img_url = request.form.get('img_url')

        # Si suben un archivo físico, se guarda y se genera la URL
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            img_url = f"http://localhost:5000/uploads/{filename}"

        conn = get_connection()
        cursor = conn.cursor()

        if tipo == 'luchadores':
            nombre = request.form.get('nombre')
            bando = request.form.get('bando')
            titulos = request.form.get('titulos')
            exp = request.form.get('exp')

            # CONTROL: Si no hay nueva imagen ni url del frente, no actualizamos la columna 'imagen'
            if img_url and img_url.strip() != "":
                query = "UPDATE luchadores SET nombre=%s, bando=%s, categoria=%s, titulos=%s, exp=%s, imagen=%s WHERE id=%s"
                cursor.execute(query, (nombre, bando, categoria, titulos, exp, img_url, id_item))
            else:
                query = "UPDATE luchadores SET nombre=%s, bando=%s, categoria=%s, titulos=%s, exp=%s WHERE id=%s"
                cursor.execute(query, (nombre, bando, categoria, titulos, exp, id_item))
        
        else: # TIENDA
            producto = request.form.get('producto')
            precio = request.form.get('precio')
            stock = request.form.get('stock')
            descripcion = request.form.get('descripcion')

            # CONTROL: Si no hay nueva imagen ni url del frente, no actualizamos la columna 'imagen'
            if img_url and img_url.strip() != "":
                query = "UPDATE tienda SET producto=%s, precio=%s, categoria=%s, stock=%s, descripcion=%s, imagen=%s WHERE id=%s"
                cursor.execute(query, (producto, precio, categoria, stock, descripcion, img_url, id_item))
            else:
                query = "UPDATE tienda SET producto=%s, precio=%s, categoria=%s, stock=%s, descripcion=%s WHERE id=%s"
                cursor.execute(query, (producto, precio, categoria, stock, descripcion, id_item))

        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Registro actualizado con éxito'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- RUTA DE CREACIÓN TRADICIONAL (POST) CORREGIDA ---

@app.route('/save_with_image', methods=['POST'])
def save_with_image():
    try:
        tipo = request.form.get('tipo')
        id_item = request.form.get('id')
        categoria = request.form.get('categoria')
        
        file = request.files.get('imagen')
        img_url = request.form.get('img_url') 

        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            img_url = f"http://localhost:5000/uploads/{filename}"

        conn = get_connection()
        cursor = conn.cursor()

        if tipo == 'luchadores':
            nombre = request.form.get('nombre')
            bando = request.form.get('bando')
            titulos = request.form.get('titulos')
            exp = request.form.get('exp')

            if id_item: # UPDATE por POST
                if img_url and img_url.strip() != "":
                    query = "UPDATE luchadores SET nombre=%s, bando=%s, categoria=%s, titulos=%s, exp=%s, imagen=%s WHERE id=%s"
                    cursor.execute(query, (nombre, bando, categoria, titulos, exp, img_url, id_item))
                else:
                    query = "UPDATE luchadores SET nombre=%s, bando=%s, categoria=%s, titulos=%s, exp=%s WHERE id=%s"
                    cursor.execute(query, (nombre, bando, categoria, titulos, exp, id_item))
            else: # INSERT
                query = "INSERT INTO luchadores (nombre, bando, categoria, titulos, exp, imagen) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(query, (nombre, bando, categoria, titulos, exp, img_url))
        
        else: # TIPO TIENDA
            producto = request.form.get('producto')
            precio = request.form.get('precio')
            stock = request.form.get('stock')
            descripcion = request.form.get('descripcion')

            if id_item: # UPDATE por POST
                if img_url and img_url.strip() != "":
                    query = "UPDATE tienda SET producto=%s, precio=%s, categoria=%s, stock=%s, descripcion=%s, imagen=%s WHERE id=%s"
                    cursor.execute(query, (producto, precio, categoria, stock, descripcion, img_url, id_item))
                else:
                    query = "UPDATE tienda SET producto=%s, precio=%s, categoria=%s, stock=%s, descripcion=%s WHERE id=%s"
                    cursor.execute(query, (producto, precio, categoria, stock, descripcion, id_item))
            else: # INSERT
                query = "INSERT INTO tienda (producto, precio, categoria, stock, descripcion, imagen) VALUES (%s, %s, %s, %s, %s, %s)"
                cursor.execute(query, (producto, precio, categoria, stock, descripcion, img_url))

        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Operación exitosa'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- RUTA DE ELIMINACIÓN ---

@app.route('/luchadores/<int:id_item>', methods=['DELETE'])
@app.route('/tienda/<int:id_item>', methods=['DELETE'])
def eliminar_item(id_item):
    try:
        tipo = 'luchadores' if 'luchadores' in request.path else 'tienda'
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM {tipo} WHERE id = %s", (id_item,))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Registro eliminado'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, usuario FROM usuarios_admin")
        res = cursor.fetchall()
        conn.close()
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    try:
        data = request.get_json()
        usuario = str(data.get('usuario', '')).strip()
        password = str(data.get('password', '')).strip()

        if not usuario or not password:
            return jsonify({"error": "Faltan datos requeridos"}), 400

        conn = get_connection()
        cursor = conn.cursor()
        query = "INSERT INTO usuarios_admin (usuario, password) VALUES (%s, %s)"
        cursor.execute(query, (usuario, password))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Administrador registrado con éxito'}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/usuarios/<int:id_user>', methods=['DELETE'])
def eliminar_usuario(id_user):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios_admin WHERE id = %s", (id_user,))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Administrador eliminado correctamente'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- LOGIN CONECTADO COMPATIBLE Y SEGURO ---

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'mensaje': 'No se recibieron datos'}), 400

        usuario_input = str(data.get('usuario', '')).strip()
        password_input = str(data.get('password', '')).strip()

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Usamos BINARY para forzar la coincidencia exacta de caracteres en MySQL
        query = "SELECT * FROM usuarios_admin WHERE BINARY usuario = %s AND BINARY password = %s"
        cursor.execute(query, (usuario_input, password_input))
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return jsonify({'success': True, 'mensaje': 'Bienvenido'})
        return jsonify({'success': False, 'mensaje': 'Usuario o contraseña incorrectos'}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
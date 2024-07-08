//Bcrypt es una librería de hashing de contraseñas.

//1) Instalamos: npm i bcrypt
//2) Importamos el módulo
import bcrypt from "bcrypt";
//Se crearan dos contraseñas una para hashear y otra para validarla:

//A) createHash: aplicar el hash al password.
//B) isValidPassword: comparar el password proporcionado por la base de datos.

//hashSync: toma el password que le pasamos y aplica el proceso de hasheo a partir de un "salt";
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//Un >>"salt"<< es un string random que hace que el proceso de Hasheo se realice de forma impredecible.

//genSaltSync(10): generar un salt, pero de 10 caracteres.

//Generalmente con 10 es suficiente, un valor muy alto puede hacer que la aplicación tomé mas tiempo en el proceso.
//Este proceso es IRREVERSIBLE.

const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);
//Compara los password, retorna true o false segun corresponda.

export { createHash, isValidPassword };

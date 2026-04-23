const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'google-cloud-key.json');

// This is the corrupted string from the log
let privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcqVRB+jZ\n1CgOW\nnfXFiIDfdDC9hBUVLJD1FymmsrJqWWC2AcbmOQfVo/24i0RRXiGqFU7TRAEvP1cts\nHf1QYSTMSX0q1qAm9y+iXGd4SHQ6wWJgS\nHjL4WP9k2kbmorxpLElvjenM/Kk9Jw7\ne3oQ/INUMlifugPHKkdqdbn0IXG1YLBkmOWT88LjCBU0AQ0jFBbmOkcuDnSeL6LR\nRsFcPiE\nWYGdY69+zLhkpJDh2wnZzK7ul3VtXiRhI8aX42V+tQtdGdwBHrRmwEWC\nt\nn2SGsXWLAkLfE8Pind360Adgk5GaufzxQJGNshmRyayBjzwM\nLw8bNHCXMZChPq41L\nBpq7CkFAgMBAAECggEAfCLhrN6EVQkk1+L3oo+4btCj/i6cvwDUMABbwbkyKjqg\nf\nvXFOrKeV3tVoZ5ayZCxTw\n5zSh5uqbD706IBL8S/lTDE0EP2kNo9sgwgUnv2FI5A8\SZXKkP6IHk9G0OpJNALCzrNCiadyI57E2vBeduCUoyhKZQMSP8asL+oVgAdrg\nWTy\nykrQSmRzmKiLva7Kq/io19/M3UqZbgR1iuBfN3FiMRKgNY8Vr8qMU54+RNBE Leuq\nkccLEEl8eCSwpbJavQmuObvALqKUJeuy1I7\\gn2JTQ4R8uzRkz38uP1NM00YNY Rzu\nnoft0ly49cpVJshS9D3IXyshcw3Nak3jula/qvcpCwKBgQDI77Ed7oteq0yLwOYi\nm736jkp3x\nLe25ZnbBaRub+YZHNITF5exzeMB/Epqc+GP1GJR4Un9UXCd2ouzi1SE\nn2PeYz1m9ThxBLuZbB3sUP+ss9XKhQRJrZ6G4+rMKD/waZYpX+mZHo/UVJUmr+w3\nKCEqN0TRBMxg5dk0ntpQVEa0hwKBgQDH1546/i3bmkAywOfMtckxWHzhLg4R8Lg2\nh7QiVbtSOwHiPyB/FatC3uI\nahuuA8LQtZjneFp6z00vlBUqmHTqVbVzJ+zXY\nnczd1HjvsbVrZvXMDIQhLfjZKeLCSZyDbWI0V6RH2BP/XAVCQSAK0THTt/ffEb2\np\nnXxazgFD1EwKBgBAQ1JNH9T7q3e3T/ARM+S7qHTRkTbdbcvnN1AwwoARfga037py\nnJOZULWdfFe9jmgoC4wxP2RXhuN88Ul0lU1HmUz\n78yxnmLitMuQ+RC5wcDKZxyc18d\nhEwB25MfspGE3QSEWFjINd7lz5Viq80l/hCfjhLrZQWcyofSoTHKrQyBAoGAAI05\nq7leGDzzCCM\nYyZkoLVGHmoth3Czb00jhSDXoXAWGofq4+dB8qmD81VdpAtyttMi\nnftf14m3cUHLJn5PkKj2ZZJPFBaeCd7k06hq3SxjfM/OCTKWfDL\nyx5z9a3zx6AMQ\nnOO72VVQRFaEEhdDvkfsHznkJ50dlzIRTG7BjR9UCgYEAkL2q11ovv60j5isMSgjV\nncVk0a8wc8DryXwnhbgpW9/BtJz\nG37Cmrd3HBCoLsU68FNFPQ/msS138UsM49P1Pzj\nukQes3abdAeI3YarSv7tfaQJrPGXpLYBDQeQN/Y/TvbCPlg1avyxzyu5y65HSyM\nv\nn5pRo0Ag0HSyeriqVadE0d7m=\n-----END PRIVATE KEY-----\n`;

// SANITIZATION
// 1. Remove all spaces
privateKey = privateKey.replace(/ /g, '');

// 2. Fix the \\gn issue (it should have been a newline)
privateKey = privateKey.replace(/\\\\gn/g, '\n');

// 3. Ensure actual newlines are present after headers
// The string already has \n (newlines) from the backtick string.
// Let's make it clean.

const json = {
  "type": "service_account",
  "project_id": "project-0b68f8cc-9136-44dd-91d",
  "private_key_id": "d123cd588e373821f31b1969a97002b7262c5588",
  "private_key": privateKey,
  "client_email": "estudio-sabor-ai@project-0b68f8cc-9136-44dd-91d.iam.gserviceaccount.com",
  "client_id": "103915136083270737707",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/estudio-sabor-ai%40project-0b68f8cc-9136-44dd-91d.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

fs.writeFileSync(keyPath, JSON.stringify(json, null, 2));
console.log('Sanitized google-cloud-key.json');

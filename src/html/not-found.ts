export const htmlNotFound = `
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 Error</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            text-align: center;
        }

        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 400px;
            width: 100%;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        h1 {
            margin: 0 0 20px;
            font-size: 2em;
            font-weight: normal;
        }

        p {
            margin: 0 0 10px;
            font-size: 1.2em;
        }

        a {
            color: #007bff;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        a:hover {
            color: #0056b3;
        }

        @media (max-width: 767px) {
            .container {
                top: 100px;
                transform: translate(-50%, -100%);
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>404 Error</h1>
        <p>The page you are looking for could not be found.</p>
        <button onclick="goToHomepage()">Go to Homepage</button>

    </div>
</body>


  <script>
    function goToHomepage() {
      // Redirige a la página de inicio sin poder regresar
      window.location.replace("https://www.google.com"); // Cambia a la URL que deseas
    }
  </script>

</html>
`;

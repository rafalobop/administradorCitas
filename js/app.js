
//variables
const mascotaInput = document.querySelector('#mascota')
const propietarioInput = document.querySelector('#propietario')
const telefonoInput = document.querySelector('#telefono')
const fechaInput = document.querySelector('#fecha')
const horaInput = document.querySelector('#hora')
const sintomasInput = document.querySelector('#sintomas')

//UI
const formulario = document.querySelector('#nueva-cita')
const contenedorCitas = document.querySelector('#citas')
let editando;


//clases
class Citas {
    constructor(){
        this.citas = []
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita]
        console.log(this.citas)
    }
    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id)
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI {
    imprimirAlerta(mensaje, tipo){
        //crear el div
        let divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12')

        //agregar en base al tipo de error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        //mensaje de error
        divMensaje.textContent = mensaje

        //agregar al dom
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))

        //quitar alerta desp de 3 segundos
        setTimeout(() =>{
            divMensaje.remove()
        },1500)
    }

    imprimirCitas({citas}){
        
        //limpiar html
        this.limpiarHTML()

        citas.forEach( cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita
            let divCitas = document.createElement('div')
            divCitas.classList.add('cita', 'p-3')
            divCitas.dataset.id = id

            //scripting de los elementos de la cita
            let mascotaParrafo = document.createElement('h2')
            mascotaParrafo.classList.add('card-title', 'font-weght-bolder')
            mascotaParrafo.textContent = mascota

            let propietarioParrafo = document.createElement('p')
            propietarioParrafo.innerHTML = `
            <span class = "font-weigth-bolder"> Propietario: </span> ${propietario}`

            let telefonoParrafo = document.createElement('p')
            telefonoParrafo.innerHTML = `
            <span class = "font-weigth-bolder"> Telefono: </span> ${telefono}`

            let fechaParrafo = document.createElement('p')
            fechaParrafo.innerHTML = `
            <span class = "font-weigth-bolder"> Fecha: </span> ${fecha}`

            let horaParrafo = document.createElement('p')
            horaParrafo.innerHTML = `
            <span class = "font-weigth-bolder"> Hora: </span> ${hora}`

            let sintomasParrafo = document.createElement('p')
            sintomasParrafo.innerHTML = `
            <span class = "font-weigth-bolder"> Sintomas: </span> ${sintomas}`

            //boton para eliminar citas
            let btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
            btnEliminar.innerHTML = "Eliminar"
            
            //boton para editar citas
            let btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-warning')
            btnEditar.innerHTML = "Editar"


            //agregar los parrafos al div cita
            divCitas.appendChild(mascotaParrafo)
            divCitas.appendChild(propietarioParrafo)
            divCitas.appendChild(telefonoParrafo)
            divCitas.appendChild(fechaParrafo)
            divCitas.appendChild(horaParrafo)
            divCitas.appendChild(sintomasParrafo)
            divCitas.appendChild(btnEliminar)
            divCitas.appendChild(btnEditar)

            //funcion para el boton
            btnEliminar.onclick = () => eliminarCita(id)
            btnEditar.onclick = () => editarCita(cita)


            //agregar las citas al html
            contenedorCitas.appendChild(divCitas)
        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI()
const administrarCitas = new Citas()

//eventsListeners
eventListeners()
function eventListeners(){
    mascotaInput.addEventListener('input', datosCita)
    propietarioInput.addEventListener('input', datosCita)
    telefonoInput.addEventListener('input', datosCita)
    fechaInput.addEventListener('input', datosCita)
    horaInput.addEventListener('input', datosCita)
    sintomasInput.addEventListener('input', datosCita)

    formulario.addEventListener('submit', nuevaCita)
}

//objeto de formulario
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: ""
}

// funcion para llenar formulario
function datosCita(e){
     citaObj[e.target.name] = e.target.value
     
}


//funciones

//valida y agrega cita a la clase de citas
function nuevaCita(e){
    e.preventDefault()

    //extraer info del objeto cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj

    // validar 
    if(mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === ""){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return;
    }


    if(editando){
        ui.imprimirAlerta('Cambios guardados')
        
        //pasar el objeto de la cita a editar
        administrarCitas.editarCita({...citaObj})


        //regresar el texto del boton a estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita'


        //salir de modo edicion
        editando = false

    }else {
        //generar un nuevo id
        citaObj.id = Date.now()


        //crear una nueva cita
        administrarCitas.agregarCita({...citaObj})    
    
        //mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente')
    }
   

    //reiniciar objeto
    reiniciarObjeto()

    //reiniciar formulario
    formulario.reset()

    //mostrar las citas en html
    ui.imprimirCitas(administrarCitas)


}

function reiniciarObjeto(){
    citaObj.mascota = ""
    citaObj.propietario = ""
    citaObj.telefono = ""
    citaObj.fecha = ""
    citaObj.hora = ""
    citaObj.sintomas = ""
    
}

function eliminarCita(id){
    //eliminar cita
    administrarCitas.eliminarCita(id)

    //muestra mje
    ui.imprimirAlerta('La cita se eliminó correctamente')
    
    //recargar citas
    ui.imprimirCitas(administrarCitas)
}

function editarCita(cita){
    //edita citas
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita

    //llamar los inputs
    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas
    

    //llenar nuevamente los inputs
    citaObj.mascota = mascota
    citaObj.propietario = propietario
    citaObj.telefono = telefono
    citaObj.fecha = fecha
    citaObj.hora = hora
    citaObj.sintomas = sintomas
    citaObj.id = id


    //cargar texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar'
    
    editando = true
}
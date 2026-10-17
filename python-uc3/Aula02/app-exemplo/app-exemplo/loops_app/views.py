from django.shortcuts import render

# Create your views here.

def index (request):
    return render(request, 'loops_app/index.html')


def pagina_for(request):
    # 1. Iterando sobre listas e range no Python (Backend)
    frutas = ["Maçã", "Banana", "Cereja", "Morango"]
    
    # Recebe um número via GET (ex: ?numero=7) ou usa 5 como padrão
    numero = int(request.GET.get('numero', 5))
    
    tabuada = []
    for i in range(1, 11):
        tabuada.append({
            'multiplicador': i,
            'resultado': numero * i
        })

    contexto = {
        'frutas': frutas,
        'numero': numero,
        'tabuada': tabuada,
    }
    return render(request, 'loops_app/index.html', contexto)
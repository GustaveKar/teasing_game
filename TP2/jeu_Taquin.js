var grille;
var nb_col;
var nb_ligne;
var img;
var afficher_num;
var deplacement;

function afficher() {
    // On cherche les données entrés par l'utilisateur      
    img = new Image();
    img.src = $('#url-image').val();
    
    nb_col = parseInt($('#nb-colonnes').val());
    nb_ligne =  parseInt($('#nb-lignes').val());
    
    if (nb_ligne<=1){
        nb_ligne = 2
    }
    if (nb_col<=1){
        nb_col = 2
    }
    afficher_num = $('#affichage').is(':checked');
    
    deplacement = 0;
    
    $(img).one('load', function(){
        
                var largeur = img.width;
                var hauteur = img.height;

//Retourne une tableau qui contient les informations des positions x,y de chaque case.
        
                grille = separer_image(largeur, hauteur,nb_col, nb_ligne);
            
                dessiner_images(img, grille, largeur, hauteur, nb_col, nb_ligne);

               });

    
    console.log(nb_col + ", " + nb_ligne + ", " + afficher_num)
    
}
function separer_image(largeur, hauteur, nb_col, nb_ligne)
{
 
    var largeur_elem = largeur/ nb_col;
    var hauteur_elem = hauteur / nb_ligne;
    
    
    var grille = new Array(nb_ligne);
    
    var position = 0;
    
    for(ligne = 0; ligne < grille.length; ligne++)
        {
            grille[ligne] = new Array(nb_col);
            pos_y = hauteur_elem * ligne;
            
            for(col = 0; col < grille[ligne].length; col++ )
                {                  
                    pos_x = largeur_elem * col;
                    //On ajoute les positions retrouvés
                    grille[ligne][col] = new Object();
                    grille[ligne][col].pos_y = pos_y;
                    grille[ligne][col].pos_x = pos_x;
                    grille[ligne][col].position = position++;
                   
                }
        }
    
    return grille;
}


//Fonction qui trouve les cases adjacentes a la case grise
function trouver_case_deplacer()
{
    var pos_ligne;
    var pos_col;
    //trouver la case grise qui peut etre deplacer
    for(ligne = 0; ligne < grille.length; ligne++)
    {

        for(col = 0; col < grille[ligne].length; col++)
            {
                if(grille[ligne][col].position == (nb_ligne * nb_col)-1)
                    {
                        pos_ligne = ligne;
                        pos_col = col;
                    }
            }
    }
    
    //rechercher les cases autour de la case grise qui peuvent etre deplacer
    case_deplacable = [];
    
    if( pos_ligne - 1 >= 0)
        {
            coor = new Object();
            coor.side = "haut";
            coor.ligne = pos_ligne-1;
            coor.col = pos_col;
            coor.pos = grille[coor.ligne][coor.col].position;
            case_deplacable.push(coor);
        }
    if( pos_ligne + 1 < nb_ligne)
        {
            coor = new Object();
            coor.side = "bas";
            coor.ligne = pos_ligne+1;
            coor.col = pos_col;
            coor.pos = grille[coor.ligne][coor.col].position;
            case_deplacable.push(coor);
        }
    
    if(pos_col - 1 >= 0)
        {
            coor = new Object();
            coor.side = "gauche";
            coor.ligne = pos_ligne;
            coor.col = pos_col-1;
            coor.pos = grille[coor.ligne][coor.col].position;
            case_deplacable.push(coor);
        }
    
    if((pos_col + 1) < nb_col)
        {
            coor = new Object();
            coor.side = "droit"
            coor.ligne = pos_ligne;
            coor.col = pos_col+1;
            coor.pos = grille[coor.ligne][coor.col].position;
            case_deplacable.push(coor);
        }
    
    //On cree un objet pour la case grise elle-meme
    coor = new Object();
    coor.ligne = pos_ligne;
    coor.col = pos_col;
    coor.pos = (nb_ligne * nb_col)-1;
    
    case_deplacable.push(coor);
    
    return case_deplacable;
    
}



//Dessine les images dans le tableau.
function dessiner_images(img, grille, largeur, hauteur, nb_col, nb_ligne)
{
    
    var case_deplacable = trouver_case_deplacer();
    //par convention la case grise est toujours le dernier élément de la liste
    case_grise = case_deplacable.pop();
    
    var largeur_elem = largeur/ nb_col;
    var hauteur_elem = hauteur / nb_ligne;
    
    var tableau = $('#planche');
    //On vide le tableau avant de dessiner les images, dans le cas où on aurait déjà dessiner les images
    var derniere_pos = (nb_col * nb_ligne) -1;
    tableau.empty();
    for(ligne = 0; ligne < grille.length; ligne++)
        {
            var tr = document.createElement('tr');
            
            tableau.append(tr);
            for(col = 0; col < grille[ligne].length; col++)
                {
                    var td = document.createElement('td');
                    var canvas = document.createElement('canvas');
                    $(canvas).attr('width', largeur_elem);
                    $(canvas).attr('height', hauteur_elem);
                    var context = canvas.getContext("2d");
                    
                    //Dessiner l'image. Voir le lien dessous pour de l'information sur la méthode drawImage
                    //http://www.w3schools.com/tags/canvas_drawimage.asp
                    
                    //On verifie si la case est une des cases qui peuvent etre deplacer
                    for(i=0; i < case_deplacable.length; i++)
                        {
                            //On bind un event sur les cases adjacentes a la case grise pour y attacher un event
                            if(case_deplacable[i].ligne == ligne && case_deplacable[i].col == col)
                                {
                                    $(td).bind("click",{gris_ligne: case_grise.ligne, gris_col: case_grise.col, ligne: ligne, col: col}, function(event){
                                        var data = event.data;
                                        deplacer_case(data.gris_ligne, data.gris_col, data.ligne, data.col);
                                    } );  
                                    
                                }
                        }

                    
                    
                    //On ne touche pas la case grise 
                    if(grille[ligne][col].position != derniere_pos)
                        {
                            context.drawImage(img, grille[ligne][col].pos_x, grille[ligne][col].pos_y, largeur_elem, hauteur_elem, 0, 0, largeur_elem, hauteur_elem);
                            
                            $(td).append(canvas);
                        }
                    else
                    {
                        
                        $(td).attr("id", "case-grise");
                    }

                    $(tr).append(td);
                    
                }            
        }
    
    $(document).one("keydown",{case_deplacable: case_deplacable, gris_ligne: case_grise.ligne, gris_col: case_grise.col}, function(e){
        var data = e.data;
        key_event(e.which, data.case_deplacable, data.gris_ligne, data.gris_col);
        e.preventDefault();
    });
    
    
}

function key_event(key_code,case_deplacable, case_grise_ligne, case_grise_col)
{
    
    switch(key_code) {
        case 37: // left
            case_trouver = trouver_case(case_deplacable, "gauche");
            if(case_trouver != null){
                deplacer_case(case_grise_ligne, case_grise_col, case_trouver.ligne, case_trouver.col);
            }
        break;

        case 38: // up
            case_trouver = trouver_case(case_deplacable, "haut");
            if(case_trouver != null){
                deplacer_case(case_grise_ligne, case_grise_col, case_trouver.ligne, case_trouver.col);
            }
        break;

        case 39: // right
            case_trouver = trouver_case(case_deplacable, "droit");
            if(case_trouver != null){
                deplacer_case(case_grise_ligne, case_grise_col, case_trouver.ligne, case_trouver.col);  
            }
        break;

        case 40: // down
            case_trouver = trouver_case(case_deplacable, "bas");
            if(case_trouver != null){
                deplacer_case(case_grise_ligne, case_grise_col, case_trouver.ligne, case_trouver.col);
            }
        break;

        default: return; // exit this handler for other keys
    }

      
}


function trouver_case(case_deplacable, cote)
{
    for(i =0; i < case_deplacable.length; i++)
        {
            if (case_deplacable[i].side == cote)
                return case_deplacable[i];
        }
    return null;
}

//Fonction qui s'occupe de deplacer deux cases selon leurs index
function deplacer_case(case_grise_ligne, case_grise_col, case_adj_ligne, case_adj_col)
{
    var tmp = grille[case_grise_ligne][case_grise_col];
    grille[case_grise_ligne][case_grise_col] = grille[case_adj_ligne][case_adj_col];
     grille[case_adj_ligne][case_adj_col] = tmp;
    dessiner_images(img,grille , img.width, img.height, nb_col, nb_ligne);
        if(verifier_position())
        {
            alert("Felicitations!!");
        }
}


function verifier_position()
{
    var position = 0;
    var valide = true;
    for(ligne = 0; ligne < grille.length; ligne++)
    {

        for(col = 0; col < grille[ligne].length; col++)
            {
                if(position != grille[ligne][col].position)
                {
                        valide = false;
                        break;
                }
                else
                    position++;
            }
    }
    
    deplacement++;
     $("#deplacement-val").html(deplacement);
    return valide;
             
}


function melanger()
{
    //Pour pouvoir faire un vrai mélange,il faut convertir le tableau 2d en tableau 1d
    grille_1d = new Array(parseInt(nb_col) * parseInt(nb_ligne));
    var position = 0;
    for(ligne=0; ligne < grille.length; ligne++)
        {
            for(col = 0; col < grille[ligne].length; col++)
                {
                    grille_1d[position++] = grille[ligne][col];
                }
        }

    shuffle(grille_1d);
    
    position = 0;
    grille_temp = grille.slice(0);
    
    //On recrée le tableau 2d une fois mélanger
    for(ligne=0; ligne < grille.length; ligne++)
        {
            for(col = 0; col < grille[ligne].length; col++)
                {
                    grille_temp[ligne][col] = grille_1d[position++]
                }
        }
    
    grille = grille_temp;
    var largeur = img.width;
    var hauteur = img.height;

    dessiner_images(img, grille, largeur, hauteur, nb_col, nb_ligne);
}

function shuffle(tab) {
    var j, x, i;
    for (i = tab.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = tab[i - 1];
        tab[i - 1] = tab[j];
        tab[j] = x;
    }
    return tab;
}

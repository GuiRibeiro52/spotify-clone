import { Link } from "react-router-dom";

export function Sidebar () {
    return (
    <div>
      <div>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>   
            </li>
            <li>
              <Link to='/artistas'>Artistas</Link>  
            </li>
            <li>
              <Link to='/playlists'>Playlist</Link>   
            </li>
            <li>
              <Link to='/profile'>Perfil</Link>  
            </li>
          </ul>
        </nav>  
      </div>
    </div>
    );
  };
  

  export default Sidebar;
  
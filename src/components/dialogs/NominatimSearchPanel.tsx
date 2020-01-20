import React, { FC, useCallback, useState } from 'react';
import { Icon } from '../panels/Icon';

interface IProps {
  active: boolean;
  onSearch: (search: string) => void;
}

const NominatimSearchPanel: FC<IProps> = ({ active, onSearch }) => {
  const [search, setSearch] = useState('Колывань');

  const setValue = useCallback(({ target: { value } }) => setSearch(value), [setSearch]);

  const onSubmit = useCallback(event => {
    event.preventDefault();
    
    if (search.length < 3) return;

    onSearch(search);
  }, [search, onSearch]);

  return (
    <form className="panel nominatim-panel active" onSubmit={onSubmit}>
      <div className="control-bar">
        <div className="nominatim-search-input">
          <input type="text" placeholder="Поиск на карте" value={search} onChange={setValue} />
        </div>

        <button>
          <Icon icon="icon-search" />
        </button>
      </div>
    </form>
  );
};

export { NominatimSearchPanel };

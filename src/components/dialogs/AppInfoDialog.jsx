// @flow
import React from 'react';
import { Scroll } from '$components/Scroll';
import { APP_INFO } from '$constants/app_info';

export const AppInfoDialog = () => (
  <div className="dialog-content">
    <div className="dialog-head">
      <div className="dialog-head-title">
        Orchid Map
      </div>
      <div className="small gray">
        версия{' '}
        {(APP_INFO.VERSION || 1)}.
        {(APP_INFO.CHANGELOG[APP_INFO.VERSION].length || 0)}.
        {(APP_INFO.CHANGELOG[APP_INFO.VERSION][APP_INFO.CHANGELOG[APP_INFO.VERSION].length - 1].length - 1 || 0)}
      </div>
      <hr />
      <div className="small app-info-list">
        <div>
          Исходный код:{' '}
          <a href="//github.com/muerwre/orchidMap" target="_blank">github.com/muerwre/orchidMap</a>
        </div>
      </div>
      <div className="small app-info-list">
        <div>
          Frontend:{' '}
          <a href="//reactjs.org/" target="_blank">ReactJS</a>,{' '}
          <a href="//leafletjs.com" target="_blank">Leaflet</a>,{' '}
          <a href="//www.liedman.net/leaflet-routing-machine/" target="_blank">Leaflet Routing Machine</a>{' '}
        </div>
        <div>
          Backend:{' '}
          <a href="//project-osrm.org/" target="_blank">OSRM</a>,{' '}
          <a href="//nodejs.org/" target="_blank">NodeJS</a>,{' '}
          <a href="//expressjs.com/" target="_blank">ExpressJS</a>,{' '}
          <a href="//mongodb.com/" target="_blank">MongoDB</a>
        </div>
      </div>
    </div>
    <Scroll className="dialog-shader">
      <div>
        <div className="app-info-changelog">
          <h2>История изменений</h2>
          {
            [...Object.keys(APP_INFO.CHANGELOG)].reverse().map((version, i) => (
              <div className="app-info-changelog-item" key={version}>
                <div className="app-info-number">{version}.</div>
                <div className="app-info-version">
                  {
                    APP_INFO.CHANGELOG[version].map((release, y) => (
                      <div className="app-info-release" key={release}>
                        <div className="app-info-number">{APP_INFO.CHANGELOG[version].length - y}.</div>
                        <div className="app-info-build">
                          {
                          APP_INFO.CHANGELOG[version][y].map((build, z) => (
                            <div className="app-info-change" key={build}>
                              <div className="app-info-number">{(z)}.</div>
                              <span>{APP_INFO.CHANGELOG[version][y][z]}</span>
                            </div>
                          ))
                        }
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Scroll>
  </div>
);


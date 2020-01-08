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
        {(APP_INFO.CHANGELOG[APP_INFO.VERSION][0].length - 1 || 0)}
      </div>
      <hr />
      <div className="small app-info-list">
        <div>
          <div>Исходный код:</div>
          <a href="//github.com/muerwre/orchid-front" target="_blank">github.com/muerwre/orchid-front</a>
          <br />
          <a href="//github.com/muerwre/orchid-backend" target="_blank">github.com/muerwre/orchid-backend</a>
        </div>
        <div>
          <div>Frontend:</div>
          <a href="//reactjs.org/" target="_blank">ReactJS</a>,{' '}
          <a href="//leafletjs.com" target="_blank">Leaflet</a>,{' '}
          <a href="//www.liedman.net/leaflet-routing-machine/" target="_blank">Leaflet Routing Machine</a>{' '}
        </div>
        <div>
          <div>Backend:</div>
          <a href="//project-osrm.org/" target="_blank">OSRM</a>,{' '}
          <a href="//golang.org/" target="_blank">Golang</a>,{' '}
          <a href="//nginx.org/" target="_blank">Nginx</a>,{' '}
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


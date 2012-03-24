ROOT_DIR     = File.expand_path(File.dirname(__FILE__))
SPEC_DIR     = File.join(ROOT_DIR, "spec")
LIB_DIR      = File.join(ROOT_DIR, "lib")
IMAGES_DIR   = File.join(ROOT_DIR, "images")
UNPACKED_DIR = File.join(ROOT_DIR, "unpacked")

task :default => "test:run"

namespace :test do
  desc "runs unit tests"
  task :run do
    `open -a 'Google Chrome' #{SPEC_DIR}/SpecRunner.html`
  end
end

desc "open popup.html"
task :popup => "build" do
  `open -a 'Google Chrome' #{UNPACKED_DIR}/pertext.html`
end

namespace :build do
  task :clean do
    rm_rf UNPACKED_DIR
    mkdir UNPACKED_DIR
    mkdir "#{UNPACKED_DIR}/images"
  end

  task :bundle => "build:clean" do
    files = Dir.glob("#{LIB_DIR}/*.js")
    `cat #{files.join(' ')} >> #{UNPACKED_DIR}/pertext.js`
  end

  task :minify => "build:bundle" do
    `jsmin <#{UNPACKED_DIR}/pertext.js >#{UNPACKED_DIR}/pertext.min.js`
    `rm #{UNPACKED_DIR}/pertext.js`
  end

  task :copy_files do
    files = %w[manifest.json pertext.html pertext.css]
    `cp #{files.join(' ')} #{UNPACKED_DIR}`

    images_files = %W[
      #{IMAGES_DIR}/icon-16.png
      #{IMAGES_DIR}/icon-19.png
      #{IMAGES_DIR}/icon-48.png
      #{IMAGES_DIR}/icon-128.png
    ]
    `cp #{images_files.join(' ')} #{UNPACKED_DIR}/images`
  end

  task :zip do
    `zip -r pertext.zip unpacked`
  end
end

desc "builds extension"
task :build  => ["build:clean", "build:bundle", "build:minify", "build:copy_files", "build:zip"]
